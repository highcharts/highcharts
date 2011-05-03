#!/usr/bin/perl -w

use strict;

sub update_man_page($);
sub update_bin_tool($);
sub update_txt_file($);
sub update_spec_file($);
sub get_file_info($);

our $directory = $ARGV[0];
our $version = $ARGV[1];
our $release = $ARGV[2];

our @man_pages = ("man/gendesc.1",  "man/genhtml.1",  "man/geninfo.1",
		  "man/genpng.1", "man/lcov.1", "man/lcovrc.5");
our @bin_tools = ("bin/gendesc", "bin/genhtml", "bin/geninfo",
		  "bin/genpng", "bin/lcov");
our @txt_files = ("README");
our @spec_files = ("rpm/lcov.spec");

if (!defined($directory) || !defined($version) || !defined($release)) {
	die("Usage: $0 <directory> <version string> <release string>\n");
}

foreach (@man_pages) {
	print("Updating man page $_\n");
	update_man_page($directory."/".$_);
}
foreach (@bin_tools) {
	print("Updating bin tool $_\n");
	update_bin_tool($directory."/".$_);
}
foreach (@txt_files) {
	print("Updating text file $_\n");
	update_txt_file($directory."/".$_);
}
foreach (@spec_files) {
	print("Updating spec file $_\n");
	update_spec_file($directory."/".$_);
}
print("Done.\n");

sub get_file_info($)
{
	my ($filename) = @_;
	my ($sec, $min, $hour, $year, $month, $day);
	my @stat;

	@stat = stat($filename);
	($sec, $min, $hour, $day, $month, $year) = localtime($stat[9]);
	$year += 1900;
	$month += 1;

	return (sprintf("%04d-%02d-%02d", $year, $month, $day),
		sprintf("%04d%02d%02d%02d%02d.%02d", $year, $month, $day,
			$hour, $min, $sec),
		sprintf("%o", $stat[2] & 07777));
}

sub update_man_page($)
{
	my ($filename) = @_;
	my @date = get_file_info($filename);
	my $date_string = $date[0];
	local *IN;
	local *OUT;

	$date_string =~ s/-/\\-/g;
	open(IN, "<$filename") || die ("Error: cannot open $filename\n");
	open(OUT, ">$filename.new") ||
		die("Error: cannot create $filename.new\n");
	while (<IN>) {
		s/\"LCOV\s+\d+\.\d+\"/\"LCOV $version\"/g;
		s/\d\d\d\d\\\-\d\d\\\-\d\d/$date_string/g;
		print(OUT $_);
	}
	close(OUT);
	close(IN);
	chmod(oct($date[2]), "$filename.new");
	system("mv", "-f", "$filename.new", "$filename");
	system("touch", "$filename", "-t", $date[1]);
}

sub update_bin_tool($)
{
	my ($filename) = @_;
	my @date = get_file_info($filename);
	local *IN;
	local *OUT;

	open(IN, "<$filename") || die ("Error: cannot open $filename\n");
	open(OUT, ">$filename.new") ||
		die("Error: cannot create $filename.new\n");
	while (<IN>) {
		s/(our\s+\$lcov_version\s*=\s*["']).*(["'].*)$/$1LCOV version $version$2/g;
		print(OUT $_);
	}
	close(OUT);
	close(IN);
	chmod(oct($date[2]), "$filename.new");
	system("mv", "-f", "$filename.new", "$filename");
	system("touch", "$filename", "-t", $date[1]);
}

sub update_txt_file($)
{
	my ($filename) = @_;
	my @date = get_file_info($filename);
	local *IN;
	local *OUT;

	open(IN, "<$filename") || die ("Error: cannot open $filename\n");
	open(OUT, ">$filename.new") ||
		die("Error: cannot create $filename.new\n");
	while (<IN>) {
		s/(Last\s+changes:\s+)\d\d\d\d-\d\d-\d\d/$1$date[0]/g;
		print(OUT $_);
	}
	close(OUT);
	close(IN);
	chmod(oct($date[2]), "$filename.new");
	system("mv", "-f", "$filename.new", "$filename");
	system("touch", "$filename", "-t", $date[1]);
}

sub update_spec_file($)
{
	my ($filename) = @_;
	my @date = get_file_info($filename);
	local *IN;
	local *OUT;

	open(IN, "<$filename") || die ("Error: cannot open $filename\n");
	open(OUT, ">$filename.new") ||
		die("Error: cannot create $filename.new\n");
	while (<IN>) {
		s/^(Version:\s*)\d+\.\d+.*$/$1$version/;
		s/^(Release:\s*).*$/$1$release/;
		print(OUT $_);
	}
	close(OUT);
	close(IN);
	system("mv", "-f", "$filename.new", "$filename");
	system("touch", "$filename", "-t", $date[1]);
}
