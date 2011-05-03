#! /bin/sh

cd image

# Space-optimized version: strip comments, drop precision to 3
# figures, eliminate duplicates.
# update(creinig): precision reduction is now done in data2ps and comments
# (except for % bound) now are also ommitted from the start

echo 'image.ps: image-unop.ps'
#echo '	grep -v "^%" < $< | sed -e "s/\.\([0-9][0-9]\)[0-9]\+/.\1/g" -e "s/\(^\| \|-\)\([0-9][0-9][0-9]\)[0-9][0-9]\.[0-9][0-9]/\1\200/g" -e "s/\(^\| \|-\)\([0-9][0-9][0-9]\)[0-9]\.[0-9][0-9]/\1\20/g" -e "s/\(^\| \|-\)\([0-9][0-9][0-9]\)\.[0-9][0-9]/\1\2/g" -e "s/\(^\| \|-\)\([0-9][0-9]\)\.\([0-9]\)[0-9]/\1\2.\30/g" | awk "\$$0 ~ /lineto/ { if ( LASTLINE == \$$0 ) next; } { LASTLINE=\$$0; print; }" > $@'
echo '	grep -v "^% bound" < $< > $@'
# Need last comment (bounding box)
echo '	tail -1 $< >> $@'
echo '	ls -l image.ps image-unop.ps'

echo 'image-unop.ps: outline.ps ring1.ps ring2.ps ring3.ps ring4.ps'
echo '	cat ring[1234].ps > $@'
# Bounding box is at bottom now.  Next two won't change it.
echo '	tail -1 $@ > bounding-box'
echo '	cat outline.ps >> $@'
echo '	cat ../tux.ps >> $@'
echo '	cat bounding-box >> $@ && rm bounding-box'

# Finished rings are precious!
echo .SECONDARY: ring1.ps ring2.ps ring3.ps ring4.ps

# Rings 1 and 4 are all thrown together.
echo RING1_DEPS:=`find $RING1 -name '*.c.*' | sed 's/\.c.*/-all.ps/' | sort | uniq`
echo RING4_DEPS:=`find $RING4 -name '*.c.*' | sed 's/\.c.*/-all.ps/' | sort | uniq`

# Other rings are divided into dirs.
echo RING2_DEPS:=`for d in $RING2; do echo $d-ring2.ps; done`
echo RING3_DEPS:=`for d in $RING3; do echo $d-ring3.ps; done`
echo

# First ring starts at inner radius.
echo 'ring1.ps: $(RING1_DEPS)'
echo "	@echo Making Ring 1"
echo "	@echo /angle 0 def > \$@"
echo "	@../draw_arrangement $FILE_SCRUNCH 0 360 $INNER_RADIUS \$(RING1_DEPS) >> \$@"
echo "	@echo Done Ring 1"

# Second ring starts at end of above ring (assume it's circular, so
# grab any bound).
echo 'ring2.ps: ring1.ps $(RING2_DEPS)'
echo "	@echo Making Ring 2"
echo "	@echo /angle 0 def > \$@"
echo "	@../rotary_arrange.sh $DIR_SPACING" `for f in $RING2; do echo $f-ring2.ps $f-ring2.angle; done` '>> $@'
echo "	@echo Done Ring 2"

# Third ring starts at end of second ring.
echo 'ring3.ps: ring2.ps $(RING3_DEPS)'
echo "	@echo Making Ring 3"
echo "	@echo /angle 0 def > \$@"
echo "	@../rotary_arrange.sh $DIR_SPACING" `for f in $RING3; do echo $f-ring3.ps $f-ring3.angle; done` '>> $@'
echo "	@echo Done Ring 3"

# Outer ring starts at end of fourth ring.
# And it's just a big ring of drivers.
echo 'ring4.ps: $(RING4_DEPS) ring3.radius'
echo "	@echo Making Ring 4"
echo "	@echo /angle 0 def > \$@"
echo "	@../draw_arrangement $FILE_SCRUNCH 0 360 \`cat ring3.radius\` \$(RING4_DEPS) >> \$@"
echo "	@echo Done Ring 4"
echo

# How to make directory picture: angle file contains start and end angle.
# Second ring starts at end of above ring (assume it's circular, so
# grab any bound).
echo "%-ring2.ps: %-ring2.angle ring1.radius"
echo "	@echo Rendering \$@"
echo "	@../draw_arrangement $FILE_SCRUNCH 0 \`cat \$<\` \`cat ring1.radius\` \`find \$* -name '*-all.ps'\` > \$@"

echo "%-ring3.ps: %-ring3.angle ring2.radius"
echo "	@echo Rendering \$@"
echo "	@../draw_arrangement $FILE_SCRUNCH 0 \`cat \$<\` \`cat ring2.radius\` \`find \$* -name '*-all.ps'\` > \$@"

# How to extract radii
echo "%.radius: %.ps"
echo '	@echo scale=2\; `tail -1 $< | sed "s/^.* //"` + '$RING_SPACING' | bc > $@'
echo

# How to make angle.  Need total angle for that directory, and weight.
echo "%-ring2.angle: %-ring2.weight ring2.weight"
echo '	@echo "scale=2; ( 360 - ' `echo $RING2 | wc -w` ' * ' $DIR_SPACING ') * `cat $<` / `cat ring2.weight`" | bc > $@'

echo "%-ring3.angle: %-ring3.weight ring3.weight"
echo '	@echo "scale=2; ( 360 - ' `echo $RING3 | wc -w` ' * ' $DIR_SPACING ') * `cat $<` / `cat ring3.weight`" | bc > $@'

# How to make ring weights (sum directory totals).
echo "ring2.weight:" `for d in $RING2; do echo $d-ring2.weight; done`
echo '	@cat $^ | ../tally > $@'
echo "ring3.weight:" `for d in $RING3; do echo $d-ring3.weight; done`
echo '	@cat $^ | ../tally > $@'

# How to make a wieght.
echo "%-ring2.weight:" `find $RING2 -name '*.c.*' | sed 's/\.c.*/-all.ps/' | sort | uniq`
echo '	@../total_area.pl `find $* -name \*-all.ps` > $@'
echo "%-ring3.weight:" `find $RING3 -name '*.c.*' | sed 's/\.c.*/-all.ps/' | sort | uniq`
echo '	@../total_area.pl `find $* -name \*-all.ps` > $@'
echo

# Now rule to make the graphs of a function.
#echo %.ps::%
#echo '	@../function2ps `echo $< | sed '\''s/^.*\.\([^.]*\)\.\+.*$$/\1/'\''` > $@ $<'
## Need the space.
##echo '	@rm -f $<'
#echo

# Rule to make all from constituent parts.
echo %-all.ps:
echo "	@echo Rendering \$*.c"
echo "	@../conglomerate_functions.pl $FUNCTION_SCRUNCH $BOX_SCRUNCH \$^ > \$@"
# Need the space.
#echo '	@rm -f $^'
echo

# Generating outline, requires all the angles.
echo outline.ps: ../make-outline.sh ring1.ps ring2.ps ring3.ps ring4.ps `for f in $RING2; do echo $f-ring2.angle; done` `for f in $RING3; do echo $f-ring3.angle; done`
echo "	../make-outline.sh $INNER_RADIUS $DIR_SPACING $RING_SPACING \"$RING1\" > \$@"
echo

# Now all the rules to make each function.
for d in `find . -type d`; do
    for f in `cd $d; ls *+.ps 2>/dev/null | sed 's/\.c\..*$//' | uniq`; do
	echo $d/$f-all.ps: `cd $d; ls $f.c.* | sed -e "s?^?$d/?"`
    done
done
