/*
 *  methods/gauss.c
 *
 *  Calculate the sum of a given range of integer numbers.
 *
 *  Somewhat of a more subtle way of calculation - and it even has a story
 *  behind it:
 *
 *  Supposedly during math classes in elementary school, the teacher of
 *  young mathematician Gauss gave the class an assignment to calculate the
 *  sum of all natural numbers between 1 and 100, hoping that this task would
 *  keep the kids occupied for some time. The story goes that Gauss had the
 *  result ready after only a few minutes. What he had written on his black
 *  board was something like this:
 *
 *    1 + 100 = 101
 *    2 + 99  = 101
 *    3 + 98  = 101
 *    .
 *    .
 *    100 + 1 = 101
 *
 *    s = (1/2) * 100 * 101 = 5050
 *
 *  A more general form of this formula would be
 *  
 *    s = (1/2) * (max + min) * (max - min + 1)
 *
 *  which is used in the piece of code below to implement the requested
 *  function in constant time, i.e. without dependencies on the size of the
 *  input parameters.
 *
 */

#include "gauss.h"


int gauss_get_sum (int min, int max)
{
	/* This algorithm doesn't work well with invalid range specifications
	   so we're intercepting them here. */
	if (max < min)
	{
		return 0;
	}

	return (int) ((max + min) * (double) (max - min + 1) / 2);
}
