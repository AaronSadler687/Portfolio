Objectives: 1) Use pointers; 2) Dynamically allocate memory; 3) Read and write files; 4) Use value-returning functions.
Project description:

In this assignment you will have the opportunity to recall what you’ve previously learned about pointers, value returning
functions, and file processing. You will write a small program that simulates just in time memory allocation, by
dynamically allocating an array, and then reallocating it as the size of the input reaches the array’s capacity.

Requirements:
1. Your program must contain the three functions listed below, in a single file named proj1.cpp:
a) main – This function must appear first in your project cpp file, and will perform the following tasks:
 Read an input file (must be named nums.txt) containing aset of integers (one per line) to be read into
the array
 Dynamically allocate an array with 200 elements (hardcoded).
 Read the remaining integers from the input file (one at a time), and add each to the array. ** You may
not read the input file more than once and you may not read the values into a container to process
later. You must process the file as you go.**
 Each time the array capacity is reached, call the calcAvg function and print (to stdout and the output
file) the count of elements, and the average of the integers read up to that point (as a double); and
invoke function doubleArray to double the size of the array, and continue reading the integers in the
input file until all input has been processed.
 After the last integer in the file is read and placed into the array, output the following to stdout and the
output file:
the size of the array, the number of integers read, and the average of those integers.
 Example:
i. Dynamically allocate an array with 200 elements (in main).
ii. Once you have read and inserted the 200th integer into the array, output the count of items
read, and the average of the values read so far, and invoke doubleArray to double the array size
– The new size is 400 (200 * 2).
iii. Continue to process the file. Upon inserting the 400th item (reaching the new capacity of the
array), repeat ii. above, to create an array of size 800 (400 * 2).
iv. Repeat this process until the input file has no more integers. Each time the capacity is reached
print the number of elements and average, and expand the array.
v. Once the end of file is reached, print the array size (it will likely be greater than the number of
integers read in), the number of elements read, and the average of those numbers.
 Prior to exiting the program, deallocate all dynamically allocated memory. You may not rely on program
termination for memory deallocation. 
b) doubleArray – This function dynamically allocates memory for an array, and when necessary copies elements
from the old array to the new and deallocates the memory of the array being expanded. It returns a pointer to
the newly allocated array. Its details follow:
 Input parameters (you may not change the order, type, or number of parameters):
i. An integer pointer to the array of integers
ii. An integer pointer for the size of the array.
 Processing and output – This function should allocate a new array at double the size of the parameter.
It should also copy the existing data to the new array, deallocate the old array, update the size of the
array, and return the integer pointer to the newly allocated array.
c) calcAvg – This function accepts as input parameters the dynamic array (an int pointer), and the number of
values that have been read into it (an int), and returns the calculated average (as a double).