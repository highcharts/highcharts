/*
 *  methods/iterate.c
 *  
 *  Calculate the sum of a given range of integer numbers.
 *
 *  This particular method of implementation works by way of brute force,
 *  i.e. it iterates over the entire range while adding the numbers to finally
 *  get the total sum. As a positive side effect, we're able to easily detect
 *  overflows, i.e. situations in which the sum would exceed the capacity
 *  of an integer variable.
 *
 */

#include <stdio.h>
#include <stdlib.h>
#include "iterate.h"


int iterate_get_sum (int min, int max)
{
	int i, total;

	total = 0;

	/* This is where we loop over each number in the range, including
	   both the minimum and the maximum number. */

	for (i = min; i <= max; i++)
	{
		/* We can detect an overflow by checking whether the new
		   sum would become negative. */

		if (total + i < total)
		{
			printf ("Error: sum too large!\n");
			exit (1);
		}

		/* Everything seems to fit into an int, so continue adding. */

		total += i;
	}

	return total;
}
