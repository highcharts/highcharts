#!/usr/bin/perl
#
#   Copyright (c) International Business Machines  Corp., 2002
#
#   This program is free software;  you can redistribute it and/or modify
#   it under the terms of the GNU General Public License as published by
#   the Free Software Foundation; either version 2 of the License, or (at
#   your option) any later version.
#
#   This program is distributed in the hope that it will be useful, but
#   WITHOUT ANY WARRANTY;  without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
#   General Public License for more details.
#
#   You should have received a copy of the GNU General Public License
#   along with this program;  if not, write to the Free Software
#   Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
#
#
# posterize.pl
#
#   This script generates a postscript file from output generated from the
#   fcgp http://sourceforge.net/projects/fcgp/ for plotting
#
#
# History:
#   2003-09-04 wrote - James M Kenefick Jr. <jkenefic@us.ibm.com>
#



# a good deal of this could be turned in to cli
# arguments.

# Constants
my $Title = "Linux Kernel Coverage";
my $KernelVersion = "2.5.73";
my $TestDescription = "A Sample Print";
my $Image = "../lgp/image.ps";

# Variables
my $Bounds = "";
# Paper sizes in inches
my $PAPER_WIDTH = 34;
my $PAPER_HEIGHT = 42;

# points per inch 
my $ppi = 72;

# Margins 
my $TopMargin = 1;
my $BottomMargin = 1.5;
my $LeftMargin = 1;
my $RightMargin = 1;


$RightMargin = $PAPER_WIDTH - $RightMargin;
$TopMargin = $PAPER_HEIGHT - $TopMargin;

my $filename = "poster.ps";

# Sizes in ppi
my $PPI_WIDTH = ($PAPER_WIDTH * $ppi);
my $PPI_HEIGHT = ($PAPER_HEIGHT * $ppi);

# Date we create poster
my $date = `date`;

print STDERR "Creating Poster\n";

open POSTER, ">$filename";



print(POSTER <<END_OF_USAGE);
%!PS-Adobe-1.0
%%DocumentFonts: Helvetica Helvetica-Bold
%%Title: Linux 2.4.0 Kernel Poster
%%Creator: Rusty's scripts and postersize (GPL)
%%CreationDate: $date 
%%Pages: 1
%%BoundingBox: 0 0 $PPI_WIDTH $PPI_HEIGHT
%%EndComments
%!
/PRorig_showpage_x178313 /showpage load def /showpage{
                                              errordict /handleerror {} put
                                             }def
/initgraphics{}def/setpagedevice{pop}def
statusdict begin /a4tray{}def /lettertray{}def end
/a4{}def/a3{}def/a0{}def/letter{}def/legal{}def
/a4small{}def /lettersmall{}def /a4tray{}def /lettertray{}def
/setscreen{pop pop pop}def
/ColorManagement {pop} def


/A {gsave newpath 0 360 arc stroke grestore} bind def
/M {moveto} bind def
/L {lineto} bind def
/D {[] 0 setdash} bind def
/D5 {[5] 0 setdash} bind def
/C0 {0 0 0 setrgbcolor} bind def
/C1 {.8 .4 .4 setrgbcolor} bind def
/C2 {.5 1 .5 setrgbcolor} bind def
/C3 {0 .7 0 setrgbcolor} bind def
/C4 {1 0 0 setrgbcolor} bind def
/C5 {0 0 1 setrgbcolor} bind def
/R {grestore} bind def
/S {0 0 M stroke} bind def
/T {gsave translate} bind def
/U {C0 newpath 4 copy 4 2 roll 8 7 roll M L L L closepath stroke
C1 findfont exch scalefont setfont M show} bind def

% Added James M Kenefick Jr.
/Hi_Color {0 0 1} def
/Med_Color {0 .60 1}  def
/Lo_Color {0 1 1} def
/None_Color {.75 .75 .75} def
/Hi {newpath 4 copy 4 2 roll 8 7 roll M L L L Hi_Color setrgbcolor fill closepath} bind def
/Med {newpath 4 copy 4 2 roll 8 7 roll M L L L Med_Color setrgbcolor fill closepath} bind def
/Lo {newpath 4 copy 4 2 roll 8 7 roll M L L L Lo_Color setrgbcolor fill closepath} bind def
/None {newpath 4 copy 4 2 roll 8 7 roll M L L L None_Color setrgbcolor fill closepath} bind def

/inch
{
	72 mul
}
def

/LeftMargin $LeftMargin inch def
/RightMargin $RightMargin inch def
/TopMargin $TopMargin inch def
/BottomMargin $BottomMargin inch def
/FontScale 25 def
/AuthorFontScale 70 def

/centerText
{
	dup
	stringwidth pop
	2 div
	RightMargin LeftMargin sub 2 div
	exch sub
	LeftMargin add
	NextLine moveto
	show	
}
def

/upLine
{
	/NextLine 
	NextLine LineSpace2 add
	def
}
def

/advanceLine
{
	/NextLine
	NextLine LineSpace sub
	def
}
def

/fontScale
{
	TopMargin BottomMargin sub FontScale div
}
def

/authorfontScale
{
	TopMargin BottomMargin sub AuthorFontScale div
}
def

/rightJustify
{
	dup
	stringwidth pop
	RightMargin 1 inch sub
	exch sub
	NextLine moveto
	show
}
def

/usableY
{
	TopMargin LineSpace 3 mul sub BottomMargin sub	
}
def

/usableX
{
	RightMargin LeftMargin sub	
}
def
gsave
/Times-Roman findfont fontScale scalefont setfont
/LineSpace fontScale def
/NextLine (B) stringwidth pop TopMargin exch sub def 

%%EndProlog
%%Page 1
% title

($Title) centerText advanceLine
(Kernel: $KernelVersion) centerText advanceLine
($TestDescription) centerText

% Author Block
LeftMargin BottomMargin translate
/Times-Roman findfont authorfontScale scalefont setfont
/LineSpace2 authorfontScale def
/NextLine 0 def
(Based on work by Rusty Russell, Christian Reiniger) rightJustify
upLine
(By James M. Kenefick Jr.) rightJustify

grestore
LeftMargin BottomMargin translate

% Key Block
15 15 scale
% This is the key for the graph.

/box { newpath moveto 0 1 rlineto 2 0 rlineto 0 -1 rlineto closepath } def
/key { setrgbcolor 2 copy box gsave fill grestore 0 0 0 setrgbcolor strokepath fill moveto 2.4 0.25 rmoveto show } def

/Helvetica-Oblique findfont
1 scalefont setfont
0.1 setlinewidth

(static functions) 1 5 0.5 1 0.5 key % Light green.
(indirectly called functions) 1 7 0 0.7 0 key % green
(exported functions) 1 9 1 0 0 key % red
(other functions) 1 11 0 0 1 key % blue

(Low Coverage) 1 15 Lo_Color key % blue
(Medium Coverage) 1 17 Med_Color key % blue
(Hi Coverage) 1 19 Hi_Color key % blue
(No Coverage) 1 21 None_Color key % blue
1 3.25 moveto
0.8 0.4 0.4 setrgbcolor
/Helvetica findfont
1 scalefont setfont
(xxx) show
1 3 moveto
2.4 0.25 rmoveto
0 0 0 setrgbcolor
/Helvetica-Oblique findfont
1 scalefont setfont
(function name) show

1 1.25 moveto
0.8 0.4 0.4 setrgbcolor
/Helvetica-Bold findfont
1 scalefont setfont
(xxx) show
1 1 moveto
2.4 0.25 rmoveto
0 0 0 setrgbcolor
/Helvetica-Oblique findfont
1 scalefont setfont
(source filename) show

6 24 moveto
/Helvetica-Bold findfont
2 scalefont setfont
(Key) show

% Box around it
newpath
0.2 0.2 moveto
0.2 27 lineto
17 27 lineto
17 0.2 lineto
closepath
strokepath fill


1 15 div 1 15 div scale

% find and move to center 
END_OF_USAGE

# Find the bounds for the image

$Bounds = `tail -1 $Image`;
($Junk, $Junk, $minX, $minY, $maxX, $maxY) = split / /, $Bounds;

my $xRange = $maxX - $minX;
my $yRange = $maxY - $minY;

if ($xRange < $yRange){
	$Range = $xRange;
} else {
	$Range = $yRange;
}
print POSTER " 0 usableY usableX sub 2 div translate\n";
print POSTER "usableX $Range div usableX $Range div scale\n";
print POSTER "$Range 2 div $Range 2 div translate\n";
print POSTER "gsave\n";
# Paste in actual image.
print POSTER `cat /home/lgp/image.ps`;
print POSTER "%%Trailer\n";
print POSTER "grestore\n";
print POSTER "showpage\n";
print POSTER "PRorig_showpage_x178313\n";
print POSTER "/showpage /PRorig_showpage_x178313 load def\n";

