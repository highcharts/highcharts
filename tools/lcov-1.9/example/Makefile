#
# Makefile for the LCOV example program.
#
# Make targets:
#   - example: compile the example program
#   - output:  run test cases on example program and create HTML output
#   - clean:   clean up directory
#

CC      := gcc
CFLAGS  := -Wall -I. -fprofile-arcs -ftest-coverage

LCOV    := ../bin/lcov
GENHTML := ../bin/genhtml
GENDESC := ../bin/gendesc
GENPNG  := ../bin/genpng

# Depending on the presence of the GD.pm perl module, we can use the
# special option '--frames' for genhtml
USE_GENPNG := $(shell $(GENPNG) --help >/dev/null 2>/dev/null; echo $$?)

ifeq ($(USE_GENPNG),0)
  FRAMES := --frames
else
  FRAMES :=
endif

.PHONY: clean output test_noargs test_2_to_2000 test_overflow

all: output

example: example.o iterate.o gauss.o
	$(CC) example.o iterate.o gauss.o -o example -lgcov

example.o: example.c iterate.h gauss.h
	$(CC) $(CFLAGS) -c example.c -o example.o

iterate.o: methods/iterate.c iterate.h
	$(CC) $(CFLAGS) -c methods/iterate.c -o iterate.o

gauss.o: methods/gauss.c gauss.h
	$(CC) $(CFLAGS) -c methods/gauss.c -o gauss.o

output: example descriptions test_noargs test_2_to_2000 test_overflow
	@echo
	@echo '*'
	@echo '* Generating HTML output'
	@echo '*'
	@echo
	$(GENHTML) trace_noargs.info trace_args.info trace_overflow.info \
		   --output-directory output --title "Basic example" \
		   --show-details --description-file descriptions $(FRAMES) \
		   --legend
	@echo
	@echo '*'
	@echo '* See '`pwd`/output/index.html
	@echo '*'
	@echo

descriptions: descriptions.txt
	$(GENDESC) descriptions.txt -o descriptions

all_tests: example test_noargs test_2_to_2000 test_overflow

test_noargs:
	@echo
	@echo '*'
	@echo '* Test case 1: running ./example without parameters'
	@echo '*'
	@echo
	$(LCOV) --zerocounters --directory .
	./example
	$(LCOV) --capture --directory . --output-file trace_noargs.info --test-name test_noargs

test_2_to_2000:
	@echo
	@echo '*'
	@echo '* Test case 2: running ./example 2 2000'
	@echo '*'
	@echo
	$(LCOV) --zerocounters --directory .
	./example 2 2000
	$(LCOV) --capture --directory . --output-file trace_args.info --test-name test_2_to_2000

test_overflow:
	@echo
	@echo '*'
	@echo '* Test case 3: running ./example 0 100000 (causes an overflow)'
	@echo '*'
	@echo
	$(LCOV) --zerocounters --directory .
	./example 0 100000 || true
	$(LCOV) --capture --directory . --output-file trace_overflow.info --test-name "test_overflow"

clean:
	rm -rf *.o *.bb *.bbg *.da *.gcno *.gcda *.info output example \
	descriptions

