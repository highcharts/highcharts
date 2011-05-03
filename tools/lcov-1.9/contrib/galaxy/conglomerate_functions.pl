#! /usr/bin/perl -w

# Takes a set of ps images (belonging to one file) and produces a
# conglomerate picture of that file: static functions in the middle,
# others around it.  Each one gets a box about its area.

use strict;

my $SCRUNCH = $ARGV [0];
my $BOXSCRUNCH = $ARGV [1];
my $Tmp;
my $DEBUG = 1;

shift @ARGV; # skip SCRUNCH and BOXSCRUNCH
shift @ARGV;


DecorateFuncs (@ARGV);


#TMPFILE=`mktemp ${TMPDIR:-/tmp}/$$.XXXXXX`

# Arrange.
my $ArgList = "";

foreach $Tmp (@ARGV) {
	$ArgList .= "'$Tmp' ";
}

my @Arranged = `../draw_arrangement $SCRUNCH 0 360 0 $ArgList`;

my $CFile = $ARGV [0];
$CFile =~ s/\.c\..*$/.c/;
if ($DEBUG) { print ("% Conglomeration of $CFile\n"); }

print "gsave angle rotate\n";

# Now output the file, except last line.
my $LastLine = pop (@Arranged);
my $Fill = Box_2 ($LastLine,$CFile);
print $Fill;
# Draw box with file name
my @Output = Box ('normal', 'Helvetica-Bold', 32, $CFile, $LastLine);
splice(@Output, $#Output, 0, "grestore\n");
#print @Output;

print (@Arranged);
#add a duplicate box to test if this works
print @Output;


sub ParseBound
{
	my $BBoxLine = shift;

	$BBoxLine =~ /(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)/;

	# XMin, YMin, XMax, YMax
	return ($1 * $BOXSCRUNCH, $2 * $BOXSCRUNCH,
		$3 * $BOXSCRUNCH, $4 * $BOXSCRUNCH);
}



# Box (type, font, fontsize, Label, BBoxLine)
sub Box
{
	my $Type     = shift;
	my $Font     = shift;
	my $Fontsize = shift;
	my $Label    = shift;
	my $BBoxLine = shift;
        my @Output   = ();

	#        print (STDERR "Box ('$Type', '$Font', '$Fontsize', '$Label', '$BBoxLine')\n");
	push (@Output, "% start of box\n");

	push (@Output, "D5\n") if ($Type eq "dashed");

	#	print (STDERR "BBoxLine: '$BBoxLine'\n");
	#	print (STDERR "Parsed: '" . join ("' '", ParseBound ($BBoxLine)) . "\n");
	my ($XMin, $YMin, $XMax, $YMax) = ParseBound ($BBoxLine);

	my $LeftSpaced   = $XMin + 6;
	my $BottomSpaced = $YMin + 6;

	# Put black box around it
	push (@Output, (
                        "($Label) $LeftSpaced $BottomSpaced $Fontsize /$Font\n",
                        "$YMin $XMin $YMax $XMax U\n"
		       )
	     );

	push (@Output, "D\n") if ($Type eq "dashed");
	# fill bounding box
	push (@Output, "% end of box\n");

	# Output bounding box
	push (@Output, "% bound $XMin $YMin $XMax $YMax\n");

        return @Output;
}

sub Box_2
{
	my $BBoxLine = shift;
	my $CFile = shift;
	my $CovFile = "./coverage.dat";
	my ($XMin, $YMin, $XMax, $YMax) = ParseBound ($BBoxLine);
	my @output = `fgrep $CFile $CovFile`;
	chomp $output[0];
	my ($junk, $Class, $per) = split /\t/, $output[0];
	return "$XMin $YMin $XMax $YMax $Class\n";
}
# Decorate (rgb-vals(1 string) filename)
sub Decorate
{
	my $RGB      = shift;
        my $Filename = shift;

        my @Input    = ReadPS ($Filename);
        my $LastLine = pop (@Input);
	my @Output   = ();

	# Color at the beginning.
	push (@Output, "C$RGB\n");

	# Now output the file, except last line.
        push (@Output, @Input);

	# Draw dashed box with function name
	# FIXME Make bound cover the label as well!
	my $FuncName = $Filename;
	$FuncName =~ s/^[^.]+\.c\.(.+?)\..*$/$1/;

	push (@Output, Box ('dashed', 'Helvetica', 24, $FuncName, $LastLine));

	# Slap over the top.
        WritePS ($Filename, @Output);
}



# Add colored boxes around functions
sub DecorateFuncs
{
	my $FName = "";
        my $FType = "";

	foreach $FName (@ARGV)
	{
		$FName =~ /\+([A-Z]+)\+/;
		$FType = $1;

		if ($FType eq 'STATIC') {
			Decorate ("2", $FName); # Light green.
 		}
 		elsif ($FType eq 'INDIRECT') {
			Decorate ("3", $FName); # Green.
 		}
 		elsif ($FType eq 'EXPORTED') {
			Decorate ("4", $FName); # Red.
 		}
 		elsif ($FType eq 'NORMAL') {
			Decorate ("5", $FName); # Blue.
		}
		else {
			die ("Unknown extension $FName");
		}
	}
}


sub ReadPS
{
	my $Filename = shift;
        my @Contents = ();

	open (INFILE, "$Filename") or die ("Could not read $Filename: $!");
	@Contents = <INFILE>;
	close (INFILE);

	return @Contents;
}

sub WritePS
{
	my $Filename = shift;

	open (OUTFILE, ">$Filename")
		or die ("Could not write $Filename: $!");
	print (OUTFILE @_);
        close (OUTFILE);
}

