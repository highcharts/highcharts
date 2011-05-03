#!/usr/bin/perl -w
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
# genflat
#
#   This script generates std output from .info files as created by the
#   geninfo script. Call it with --help to get information on usage and 
#   available options.  This code is based on the lcov genhtml script
#   by Peter Oberparleiter <Peter.Oberparleiter@de.ibm.com>
#
#
# History:
#   2003-08-19 ripped up Peter's script James M Kenefick Jr. <jkenefic@us.ibm.com>
#

use strict;
use File::Basename; 
use Getopt::Long;
# Constants
our $lcov_version = "";
our $lcov_url = "";

# Specify coverage rate limits (in %) for classifying file entries
# HI:   $hi_limit <= rate <= 100          graph color: green
# MED: $med_limit <= rate <  $hi_limit    graph color: orange
# LO:          0  <= rate <  $med_limit   graph color: red
our $hi_limit	= 50;
our $med_limit	= 15;

# Data related prototypes
sub print_usage(*);
sub gen_html();
sub process_dir($);
sub process_file($$$);
sub info(@);
sub read_info_file($);
sub get_info_entry($);
sub set_info_entry($$$$;$$);
sub get_prefix(@);
sub shorten_prefix($);
sub get_dir_list(@);
sub get_relative_base_path($);
sub get_date_string();
sub split_filename($);
sub subtract_counts($$);
sub add_counts($$);
sub apply_baseline($$);
sub combine_info_files($$);
sub combine_info_entries($$);
sub apply_prefix($$);
sub escape_regexp($);


# HTML related prototypes


sub write_file_table(*$$$$);


# Global variables & initialization
our %info_data;		# Hash containing all data from .info file
our $dir_prefix;	# Prefix to remove from all sub directories
our %test_description;	# Hash containing test descriptions if available
our $date = get_date_string();

our @info_filenames;	# List of .info files to use as data source
our $test_title;	# Title for output as written to each page header
our $output_directory;	# Name of directory in which to store output
our $base_filename;	# Optional name of file containing baseline data
our $desc_filename;	# Name of file containing test descriptions
our $css_filename;	# Optional name of external stylesheet file to use
our $quiet;		# If set, suppress information messages
our $help;		# Help option flag
our $version;		# Version option flag
our $show_details;	# If set, generate detailed directory view
our $no_prefix;		# If set, do not remove filename prefix
our $frames;		# If set, use frames for source code view
our $keep_descriptions;	# If set, do not remove unused test case descriptions
our $no_sourceview;	# If set, do not create a source code view for each file
our $tab_size = 8;	# Number of spaces to use in place of tab

our $cwd = `pwd`;	# Current working directory
chomp($cwd);
our $tool_dir = dirname($0);	# Directory where genhtml tool is installed


#
# Code entry point
#

# Add current working directory if $tool_dir is not already an absolute path
if (! ($tool_dir =~ /^\/(.*)$/))
{
	$tool_dir = "$cwd/$tool_dir";
}

# Parse command line options
if (!GetOptions("output-directory=s"	=> \$output_directory,
		"css-file=s"		=> \$css_filename,
		"baseline-file=s"	=> \$base_filename,
		"prefix=s"		=> \$dir_prefix,
		"num-spaces=i"		=> \$tab_size,
		"no-prefix"		=> \$no_prefix,
		"quiet"			=> \$quiet,
		"help"			=> \$help,
		"version"		=> \$version
		))
{
	print_usage(*STDERR);
	exit(1);
}

@info_filenames = @ARGV;

# Check for help option
if ($help)
{
	print_usage(*STDOUT);
	exit(0);
}

# Check for version option
if ($version)
{
	print($lcov_version."\n");
	exit(0);
}

# Check for info filename
if (!@info_filenames)
{
	print(STDERR "No filename specified\n");
	print_usage(*STDERR);
	exit(1);
}

# Generate a title if none is specified
if (!$test_title)
{
	if (scalar(@info_filenames) == 1)
	{
		# Only one filename specified, use it as title
		$test_title = basename($info_filenames[0]);
	}
	else
	{
		# More than one filename specified, used default title
		$test_title = "unnamed";
	}
}

# Make sure tab_size is within valid range
if ($tab_size < 1)
{
	print(STDERR "ERROR: invalid number of spaces specified: ".
		     "$tab_size!\n");
	exit(1);
}

# Do something
gen_html();

exit(0);



#
# print_usage(handle)
#
# Print usage information.
#

sub print_usage(*)
{
	local *HANDLE = $_[0];
	my $executable_name = basename($0);

	print(HANDLE <<END_OF_USAGE);
Usage: $executable_name [OPTIONS] INFOFILE(S)

Create HTML output for coverage data found in INFOFILE. Note that INFOFILE
may also be a list of filenames.

  -h, --help                        Print this help, then exit
  -v, --version                     Print version number, then exit
  -q, --quiet                       Do not print progress messages
  -b, --baseline-file BASEFILE      Use BASEFILE as baseline file
  -p, --prefix PREFIX               Remove PREFIX from all directory names
      --no-prefix                   Do not remove prefix from directory names
      --no-source                   Do not create source code view
      --num-spaces NUM              Replace tabs with NUM spaces in source view

See $lcov_url for more information about this tool.
END_OF_USAGE
	;
}


#
# gen_html()
#
# Generate a set of HTML pages from contents of .info file INFO_FILENAME.
# Files will be written to the current directory. If provided, test case
# descriptions will be read from .tests file TEST_FILENAME and included
# in ouput.
#
# Die on error.
#

sub gen_html()
{
	local *HTML_HANDLE;
	my %overview;
	my %base_data;
	my $lines_found;
	my $lines_hit;
	my $overall_found = 0;
	my $overall_hit = 0;
	my $dir_name;
	my $link_name;
	my @dir_list;
	my %new_info;

	# Read in all specified .info files
	foreach (@info_filenames)
	{
		info("Reading data file $_\n");
		%new_info = %{read_info_file($_)};

		# Combine %new_info with %info_data
		%info_data = %{combine_info_files(\%info_data, \%new_info)};
	}

	info("Found %d entries.\n", scalar(keys(%info_data)));

	# Read and apply baseline data if specified
	if ($base_filename)
	{
		# Read baseline file
		info("Reading baseline file $base_filename\n");
		%base_data = %{read_info_file($base_filename)};
		info("Found %d entries.\n", scalar(keys(%base_data)));

		# Apply baseline
		info("Subtracting baseline data.\n");
		%info_data = %{apply_baseline(\%info_data, \%base_data)};
	}

	@dir_list = get_dir_list(keys(%info_data));

	if ($no_prefix)
	{
		# User requested that we leave filenames alone
		info("User asked not to remove filename prefix\n");
	}
	elsif (!defined($dir_prefix))
	{
		# Get prefix common to most directories in list
		$dir_prefix = get_prefix(@dir_list);

		if ($dir_prefix)
		{
			info("Found common filename prefix \"$dir_prefix\"\n");
		}
		else
		{
			info("No common filename prefix found!\n");
			$no_prefix=1;
		}
	}
	else
	{
		info("Using user-specified filename prefix \"".
		     "$dir_prefix\"\n");
	}

	# Process each subdirectory and collect overview information
	foreach $dir_name (@dir_list)
	{
		($lines_found, $lines_hit) = process_dir($dir_name);

		$overview{$dir_name} = "$lines_found,$lines_hit, ";
		$overall_found	+= $lines_found;
		$overall_hit	+= $lines_hit;
	}


	if ($overall_found == 0)
	{
		info("Warning: No lines found!\n");
	}
	else
	{
		info("Overall coverage rate: %d of %d lines (%.1f%%)\n",
		     $overall_hit, $overall_found,
		     $overall_hit*100/$overall_found);
	}
}


#
# process_dir(dir_name)
#

sub process_dir($)
{
	my $abs_dir = $_[0];
	my $trunc_dir;
	my $rel_dir = $abs_dir;
	my $base_dir;
	my $filename;
	my %overview;
	my $lines_found;
	my $lines_hit;
	my $overall_found=0;
	my $overall_hit=0;
	my $base_name;
	my $extension;
	my $testdata;
	my %testhash;
	local *HTML_HANDLE;

	# Remove prefix if applicable
	if (!$no_prefix)
	{
		# Match directory name beginning with $dir_prefix
	        $rel_dir = apply_prefix($rel_dir, $dir_prefix);
	}

	$trunc_dir = $rel_dir;

	# Remove leading /
	if ($rel_dir =~ /^\/(.*)$/)
	{
		$rel_dir = substr($rel_dir, 1);
	}

	$base_dir = get_relative_base_path($rel_dir);

	$abs_dir = escape_regexp($abs_dir);

	# Match filenames which specify files in this directory, not including
	# sub-directories
	foreach $filename (grep(/^$abs_dir\/[^\/]*$/,keys(%info_data)))
	{
		($lines_found, $lines_hit, $testdata) =
			process_file($trunc_dir, $rel_dir, $filename);

		$base_name = basename($filename);

		$overview{$base_name} = "$lines_found,$lines_hit";

		$testhash{$base_name} = $testdata;

		$overall_found	+= $lines_found;
		$overall_hit	+= $lines_hit;
	}
	write_file_table($abs_dir, "./linux/", \%overview, \%testhash, 4);


	# Calculate resulting line counts
	return ($overall_found, $overall_hit);
}


#
# process_file(trunc_dir, rel_dir, filename)
#

sub process_file($$$)
{
	info("Processing file ".apply_prefix($_[2], $dir_prefix)."\n");
	my $trunc_dir = $_[0];
	my $rel_dir = $_[1];
	my $filename = $_[2];
	my $base_name = basename($filename);
	my $base_dir = get_relative_base_path($rel_dir);
	my $testdata;
	my $testcount;
	my $sumcount;
	my $funcdata;
	my $lines_found;
	my $lines_hit;
	my @source;
	my $pagetitle;

	($testdata, $sumcount, $funcdata, $lines_found, $lines_hit) =
		get_info_entry($info_data{$filename});
	return ($lines_found, $lines_hit, $testdata);
}


#
# read_info_file(info_filename)
#
# Read in the contents of the .info file specified by INFO_FILENAME. Data will
# be returned as a reference to a hash containing the following mappings:
#
# %result: for each filename found in file -> \%data
#
# %data: "test"  -> \%testdata
#        "sum"   -> \%sumcount
#        "func"  -> \%funcdata
#        "found" -> $lines_found (number of instrumented lines found in file)
#	 "hit"   -> $lines_hit (number of executed lines in file)
#
# %testdata: name of test affecting this file -> \%testcount
#
# %testcount: line number -> execution count for a single test
# %sumcount : line number -> execution count for all tests
# %funcdata : line number -> name of function beginning at that line
# 
# Note that .info file sections referring to the same file and test name
# will automatically be combined by adding all execution counts.
#
# Note that if INFO_FILENAME ends with ".gz", it is assumed that the file
# is compressed using GZIP. If available, GUNZIP will be used to decompress
# this file.
#
# Die on error
#

sub read_info_file($)
{
	my $tracefile = $_[0];		# Name of tracefile
	my %result;			# Resulting hash: file -> data
	my $data;			# Data handle for current entry
	my $testdata;			#       "             "
	my $testcount;			#       "             "
	my $sumcount;			#       "             "
	my $funcdata;			#       "             "
	my $line;			# Current line read from .info file
	my $testname;			# Current test name
	my $filename;			# Current filename
	my $hitcount;			# Count for lines hit
	my $count;			# Execution count of current line
	my $negative;			# If set, warn about negative counts
	local *INFO_HANDLE;		# Filehandle for .info file

	# Check if file exists and is readable
	stat($_[0]);
	if (!(-r _))
	{
		die("ERROR: cannot read file $_[0]!\n");
	}

	# Check if this is really a plain file
	if (!(-f _))
	{
		die("ERROR: not a plain file: $_[0]!\n");
	}

	# Check for .gz extension
	if ($_[0] =~ /^(.*)\.gz$/)
	{
		# Check for availability of GZIP tool
		system("gunzip -h >/dev/null 2>/dev/null")
			and die("ERROR: gunzip command not available!\n");

		# Check integrity of compressed file
		system("gunzip -t $_[0] >/dev/null 2>/dev/null")
			and die("ERROR: integrity check failed for ".
				"compressed file $_[0]!\n");

		# Open compressed file
		open(INFO_HANDLE, "gunzip -c $_[0]|")
			or die("ERROR: cannot start gunzip to uncompress ".
			       "file $_[0]!\n");
	}
	else
	{
		# Open uncompressed file
		open(INFO_HANDLE, $_[0])
			or die("ERROR: cannot read file $_[0]!\n");
	}

	$testname = "";
	while (<INFO_HANDLE>)
	{
		chomp($_);
		$line = $_;

		# Switch statement
		foreach ($line)
		{
			/^TN:(\w+)/ && do
			{
				# Test name information found
				$testname = $1;
				last;
			};

			/^[SK]F:(.*)/ && do
			{
				# Filename information found
				# Retrieve data for new entry
				$filename = $1;

				$data = $result{$filename};
				($testdata, $sumcount, $funcdata) =
					get_info_entry($data);

				if (defined($testname))
				{
					$testcount = $testdata->{$testname};
				}
				else
				{
					my %new_hash;
					$testcount = \%new_hash;
				}
				last;
			};

			/^DA:(\d+),(-?\d+)/ && do
			{
				# Fix negative counts
				$count = $2 < 0 ? 0 : $2;
				if ($2 < 0)
				{
					$negative = 1;
				}
				# Execution count found, add to structure
				# Add summary counts
				$sumcount->{$1} += $count;

				# Add test-specific counts
				if (defined($testname))
				{
					$testcount->{$1} += $count;
				}
				last;
			};

			/^FN:(\d+),([^,]+)/ && do
			{
				# Function data found, add to structure
				$funcdata->{$1} = $2;
				last;
			};

			/^end_of_record/ && do
			{
				# Found end of section marker
				if ($filename)
				{
					# Store current section data
					if (defined($testname))
					{
						$testdata->{$testname} =
							$testcount;
					}
					set_info_entry($data, $testdata,
						       $sumcount, $funcdata);
					$result{$filename} = $data;
				}

			};

			# default
			last;
		}
	}
	close(INFO_HANDLE);

	# Calculate lines_found and lines_hit for each file
	foreach $filename (keys(%result))
	{
		$data = $result{$filename};

		($testdata, $sumcount, $funcdata) = get_info_entry($data);

		$data->{"found"} = scalar(keys(%{$sumcount}));
		$hitcount = 0;

		foreach (keys(%{$sumcount}))
		{
			if ($sumcount->{$_} >0) { $hitcount++; }
		}

		$data->{"hit"} = $hitcount;

		$result{$filename} = $data;
	}

	if (scalar(keys(%result)) == 0)
	{
		die("ERROR: No valid records found in tracefile $tracefile\n");
	}
	if ($negative)
	{
		warn("WARNING: Negative counts found in tracefile ".
		     "$tracefile\n");
	}

	return(\%result);
}


#
# get_info_entry(hash_ref)
#
# Retrieve data from an entry of the structure generated by read_info_file().
# Return a list of references to hashes:
# (test data hash ref, sum count hash ref, funcdata hash ref, lines found,
#  lines hit)
#

sub get_info_entry($)
{
	my $testdata_ref = $_[0]->{"test"};
	my $sumcount_ref = $_[0]->{"sum"};
	my $funcdata_ref = $_[0]->{"func"};
	my $lines_found  = $_[0]->{"found"};
	my $lines_hit    = $_[0]->{"hit"};

	return ($testdata_ref, $sumcount_ref, $funcdata_ref, $lines_found,
	        $lines_hit);
}


#
# set_info_entry(hash_ref, testdata_ref, sumcount_ref, funcdata_ref[,
#                lines_found, lines_hit])
#
# Update the hash referenced by HASH_REF with the provided data references.
#

sub set_info_entry($$$$;$$)
{
	my $data_ref = $_[0];

	$data_ref->{"test"} = $_[1];
	$data_ref->{"sum"} = $_[2];
	$data_ref->{"func"} = $_[3];

	if (defined($_[4])) { $data_ref->{"found"} = $_[4]; }
	if (defined($_[5])) { $data_ref->{"hit"} = $_[5]; }
}


#
# get_prefix(filename_list)
#
# Search FILENAME_LIST for a directory prefix which is common to as many
# list entries as possible, so that removing this prefix will minimize the
# sum of the lengths of all resulting shortened filenames.
#

sub get_prefix(@)
{
	my @filename_list = @_;		# provided list of filenames
	my %prefix;			# mapping: prefix -> sum of lengths
	my $current;			# Temporary iteration variable

	# Find list of prefixes
	foreach (@filename_list)
	{
		# Need explicit assignment to get a copy of $_ so that
		# shortening the contained prefix does not affect the list
		$current = shorten_prefix($_);
		while ($current = shorten_prefix($current))
		{
			# Skip rest if the remaining prefix has already been
			# added to hash
			if ($prefix{$current}) { last; }

			# Initialize with 0
			$prefix{$current}="0";
		}

	}

	# Calculate sum of lengths for all prefixes
	foreach $current (keys(%prefix))
	{
		foreach (@filename_list)
		{
			# Add original length
			$prefix{$current} += length($_);

			# Check whether prefix matches
			if (substr($_, 0, length($current)) eq $current)
			{
				# Subtract prefix length for this filename
				$prefix{$current} -= length($current);
			}
		}
	}

	# Find and return prefix with minimal sum
	$current = (keys(%prefix))[0];

	foreach (keys(%prefix))
	{
		if ($prefix{$_} < $prefix{$current})
		{
			$current = $_;
		}
	}

	return($current);
}


#
# shorten_prefix(prefix)
#
# Return PREFIX shortened by last directory component.
#

sub shorten_prefix($)
{
	my @list = split("/", $_[0]);

	pop(@list);
	return join("/", @list);
}



#
# get_dir_list(filename_list)
#
# Return sorted list of directories for each entry in given FILENAME_LIST.
#

sub get_dir_list(@)
{
	my %result;

	foreach (@_)
	{
		$result{shorten_prefix($_)} = "";
	}

	return(sort(keys(%result)));
}


#
# get_relative_base_path(subdirectory)
#
# Return a relative path string which references the base path when applied
# in SUBDIRECTORY.
#
# Example: get_relative_base_path("fs/mm") -> "../../"
#

sub get_relative_base_path($)
{
	my $result = "";
	my $index;

	# Make an empty directory path a special case
	if (!$_[0]) { return(""); }

	# Count number of /s in path
	$index = ($_[0] =~ s/\//\//g);

	# Add a ../ to $result for each / in the directory path + 1
	for (; $index>=0; $index--)
	{
		$result .= "../";
	}

	return $result;
}


#
# get_date_string()
#
# Return the current date in the form: yyyy-mm-dd
#

sub get_date_string()
{
	my $year;
	my $month;
	my $day;

	($year, $month, $day) = (localtime())[5, 4, 3];

	return sprintf("%d-%02d-%02d", $year+1900, $month+1, $day);
}


#
# split_filename(filename)
#
# Return (path, filename, extension) for a given FILENAME.
#

sub split_filename($)
{
	if (!$_[0]) { return(); }
	my @path_components = split('/', $_[0]);
	my @file_components = split('\.', pop(@path_components));
	my $extension = pop(@file_components);

	return (join("/",@path_components), join(".",@file_components),
		$extension);
}


#
# write_file_table(filehandle, base_dir, overview, testhash, fileview)
#
# Write a complete file table. OVERVIEW is a reference to a hash containing
# the following mapping:
#
#   filename -> "lines_found,lines_hit,page_link"
#
# TESTHASH is a reference to the following hash:
#
#   filename -> \%testdata
#   %testdata: name of test affecting this file -> \%testcount
#   %testcount: line number -> execution count for a single test
#
# Heading of first column is "Filename" if FILEVIEW is true, "Directory name"
# otherwise.
#

sub write_file_table(*$$$$)
{
	my $dir = $_[0];
	my $base_dir = $_[1];
	my %overview = %{$_[2]};
	my %testhash = %{$_[3]};
	my $fileview = $_[4];
	my $filename;
	my $hit;
	my $found;
	my $classification;
	my $rate_string;
	my $rate;
	my $junk;


	foreach $filename (sort(keys(%overview)))
	{
		($found, $hit, $junk) = split(",", $overview{$filename});
#James I think this is right
		$rate = $hit * 100 / $found;
		$rate_string = sprintf("%.1f", $rate);

		if ($rate < 0.001)			{ $classification = "None"; }
		elsif ($rate < $med_limit)	{ $classification = "Lo"; }
		elsif ($rate < $hi_limit)	{ $classification = "Med"; }
		else				{ $classification = "Hi"; }

		print "$dir/$filename\t$classification\t$rate_string\n";

	}
}


#
# info(printf_parameter)
#
# Use printf to write PRINTF_PARAMETER to stdout only when the $quiet flag
# is not set.
#

sub info(@)
{
	if (!$quiet)
	{
		# Print info string
		printf(STDERR @_);
	}
}


#
# subtract_counts(data_ref, base_ref)
#

sub subtract_counts($$)
{
	my %data = %{$_[0]};
	my %base = %{$_[1]};
	my $line;
	my $data_count;
	my $base_count;
	my $hit = 0;
	my $found = 0;

	foreach $line (keys(%data))
	{
		$found++;
		$data_count = $data{$line};
		$base_count = $base{$line};

		if (defined($base_count))
		{
			$data_count -= $base_count;

			# Make sure we don't get negative numbers
			if ($data_count<0) { $data_count = 0; }
		}

		$data{$line} = $data_count;
		if ($data_count > 0) { $hit++; }
	}

	return (\%data, $found, $hit);
}


#
# add_counts(data1_ref, data2_ref)
#
# DATA1_REF and DATA2_REF are references to hashes containing a mapping
#
#   line number -> execution count
#
# Return a list (RESULT_REF, LINES_FOUND, LINES_HIT) where RESULT_REF
# is a reference to a hash containing the combined mapping in which
# execution counts are added.
#

sub add_counts($$)
{
	my %data1 = %{$_[0]};	# Hash 1
	my %data2 = %{$_[1]};	# Hash 2
	my %result;		# Resulting hash
	my $line;		# Current line iteration scalar
	my $data1_count;	# Count of line in hash1
	my $data2_count;	# Count of line in hash2
	my $found = 0;		# Total number of lines found
	my $hit = 0;		# Number of lines with a count > 0

	foreach $line (keys(%data1))
	{
		$data1_count = $data1{$line};
		$data2_count = $data2{$line};

		# Add counts if present in both hashes
		if (defined($data2_count)) { $data1_count += $data2_count; }

		# Store sum in %result
		$result{$line} = $data1_count;

		$found++;
		if ($data1_count > 0) { $hit++; }
	}

	# Add lines unique to data2
	foreach $line (keys(%data2))
	{
		# Skip lines already in data1
		if (defined($data1{$line})) { next; }

		# Copy count from data2
		$result{$line} = $data2{$line};

		$found++;
		if ($result{$line} > 0) { $hit++; }
	}

	return (\%result, $found, $hit);
}


#
# apply_baseline(data_ref, baseline_ref)
#
# Subtract the execution counts found in the baseline hash referenced by
# BASELINE_REF from actual data in DATA_REF.
#

sub apply_baseline($$)
{
	my %data_hash = %{$_[0]};
	my %base_hash = %{$_[1]};
	my $filename;
	my $testname;
	my $data;
	my $data_testdata;
	my $data_funcdata;
	my $data_count;
	my $base;
	my $base_testdata;
	my $base_count;
	my $sumcount;
	my $found;
	my $hit;

	foreach $filename (keys(%data_hash))
	{
		# Get data set for data and baseline
		$data = $data_hash{$filename};
		$base = $base_hash{$filename};

		# Get set entries for data and baseline
		($data_testdata, undef, $data_funcdata) =
			get_info_entry($data);
		($base_testdata, $base_count) = get_info_entry($base);

		# Sumcount has to be calculated anew
		$sumcount = {};

		# For each test case, subtract test specific counts
		foreach $testname (keys(%{$data_testdata}))
		{
			# Get counts of both data and baseline
			$data_count = $data_testdata->{$testname};

			$hit = 0;

			($data_count, undef, $hit) =
				subtract_counts($data_count, $base_count);

			# Check whether this test case did hit any line at all
			if ($hit > 0)
			{
				# Write back resulting hash
				$data_testdata->{$testname} = $data_count;
			}
			else
			{
				# Delete test case which did not impact this
				# file
				delete($data_testdata->{$testname});
			}

			# Add counts to sum of counts
			($sumcount, $found, $hit) =
				add_counts($sumcount, $data_count);
		}

		# Write back resulting entry
		set_info_entry($data, $data_testdata, $sumcount,
			       $data_funcdata, $found, $hit);

		$data_hash{$filename} = $data;
	}

	return (\%data_hash);
}


#
# combine_info_entries(entry_ref1, entry_ref2)
#
# Combine .info data entry hashes referenced by ENTRY_REF1 and ENTRY_REF2.
# Return reference to resulting hash.
#

sub combine_info_entries($$)
{
	my $entry1 = $_[0];	# Reference to hash containing first entry
	my $testdata1;
	my $sumcount1;
	my $funcdata1;

	my $entry2 = $_[1];	# Reference to hash containing second entry
	my $testdata2;
	my $sumcount2;
	my $funcdata2;

	my %result;		# Hash containing combined entry
	my %result_testdata;
	my $result_sumcount = {};
	my %result_funcdata;
	my $lines_found;
	my $lines_hit;

	my $testname;

	# Retrieve data
	($testdata1, $sumcount1, $funcdata1) = get_info_entry($entry1);
	($testdata2, $sumcount2, $funcdata2) = get_info_entry($entry2);

	# Combine funcdata
	foreach (keys(%{$funcdata1}))
	{
		$result_funcdata{$_} = $funcdata1->{$_};
	}

	foreach (keys(%{$funcdata2}))
	{
		$result_funcdata{$_} = $funcdata2->{$_};
	}
	
	# Combine testdata
	foreach $testname (keys(%{$testdata1}))
	{
		if (defined($testdata2->{$testname}))
		{
			# testname is present in both entries, requires
			# combination
			($result_testdata{$testname}) =
				add_counts($testdata1->{$testname},
					   $testdata2->{$testname});
		}
		else
		{
			# testname only present in entry1, add to result
			$result_testdata{$testname} = $testdata1->{$testname};
		}

		# update sum count hash
		($result_sumcount, $lines_found, $lines_hit) =
			add_counts($result_sumcount,
				   $result_testdata{$testname});
	}

	foreach $testname (keys(%{$testdata2}))
	{
		# Skip testnames already covered by previous iteration
		if (defined($testdata1->{$testname})) { next; }

		# testname only present in entry2, add to result hash
		$result_testdata{$testname} = $testdata2->{$testname};

		# update sum count hash
		($result_sumcount, $lines_found, $lines_hit) =
			add_counts($result_sumcount,
				   $result_testdata{$testname});
	}
	
	# Calculate resulting sumcount

	# Store result
	set_info_entry(\%result, \%result_testdata, $result_sumcount,
		       \%result_funcdata, $lines_found, $lines_hit);

	return(\%result);
}


#
# combine_info_files(info_ref1, info_ref2)
#
# Combine .info data in hashes referenced by INFO_REF1 and INFO_REF2. Return
# reference to resulting hash.
#

sub combine_info_files($$)
{
	my %hash1 = %{$_[0]};
	my %hash2 = %{$_[1]};
	my $filename;

	foreach $filename (keys(%hash2))
	{
		if ($hash1{$filename})
		{
			# Entry already exists in hash1, combine them
			$hash1{$filename} =
				combine_info_entries($hash1{$filename},
						     $hash2{$filename});
		}
		else
		{
			# Entry is unique in both hashes, simply add to
			# resulting hash
			$hash1{$filename} = $hash2{$filename};
		}
	}

	return(\%hash1);
}


#
# apply_prefix(filename, prefix)
#
# If FILENAME begins with PREFIX, remove PREFIX from FILENAME and return
# resulting string, otherwise return FILENAME.
#

sub apply_prefix($$)
{
	my $filename = $_[0];
	my $prefix = $_[1];
	my $clean_prefix = escape_regexp($prefix);

	if (defined($prefix) && ($prefix ne ""))
	{
		if ($filename =~ /^$clean_prefix\/(.*)$/)
		{
			return substr($filename, length($prefix) + 1);
		}
	}

	return $filename;
}


#
# escape_regexp(string)
#
# Escape special characters in STRING which would be incorrectly interpreted
# in a PERL regular expression.
#

sub escape_regexp($)
{
	my $string = $_[0];
	
	# Escape special characters
	$string =~ s/\\/\\\\/g;
	$string =~ s/\^/\\\^/g;
	$string =~ s/\$/\\\$/g;
	$string =~ s/\./\\\./g;
	$string =~ s/\|/\\\|/g;
	$string =~ s/\(/\\\(/g;
	$string =~ s/\)/\\\)/g;
	$string =~ s/\[/\\\[/g;
	$string =~ s/\]/\\\]/g;
	$string =~ s/\*/\\\*/g;
	$string =~ s/\?/\\\?/g;
	$string =~ s/\{/\\\{/g;
	$string =~ s/\}/\\\}/g;
	$string =~ s/\+/\\\+/g;

	return $string;
}
