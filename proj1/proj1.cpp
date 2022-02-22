/*
* Name: Aaron Sadler
* Overview: Dynamically allocate and shrink an array of intergers given a input file
* and print it to the screen and an output file.
* CSCI 3110-001
* Project: #1
* Due: 08/31/21
*/



#include <iostream>
#include <fstream>

using namespace std;

int main()
{
	ifstream inFile;			
	inFile.open("nums.txt");	// Open infile

	int* shrinkArray(int* arr, int count);	// Function prototype
	double calcAvg(int* arr, int size);	// Function prototype

	int max = 0;				// A variable to track the intial number of max possible ints within the file
	int count = 0;				// A variable to track the ACTUAL number of ints in the file
	double average = 0;				// A variable to store the average of the ints within the array

	inFile >> max;				// Read the first line of the input file, and set the int into count
	int* arr = new int[max];	// Dynamically allocate the array to the size of count
	int* newArr;				// A int pointer that will point to the dynamically allocated array

	cout << max << endl;		// Output the intial size to the screen

	ofstream outFile;
	outFile.open("out.txt");	// Open outfile

	outFile << max << endl;		// Output the intial size to the outfile

	while (inFile >> arr[count])		// Loop through the file placing each read int into arr
	{
		count++;				// Increment count
	}

	newArr = shrinkArray(arr, count);	// Call shrinkArray
	average = calcAvg(newArr, count);	// Call calcAvg

	cout << count << " " << average << endl;	// Print exact size and average to the screen
	outFile << count << " " << average << endl;	// Print exact size and average to output file

	delete [] newArr;					// Deallocate memory
	newArr = nullptr;					// Deallocate memory

	return 0;
} // End of Main

// shrinkArray - Takes in a interger pointer to an array, and the exact size of that array, and then dynamically shrinks the array to be the exact size of elements within.
int* shrinkArray(int* arr, int count)
{
	int* newArr = new int[count];

	for (int i = 0; i < count; i++)
	{
		newArr[i] = arr[i];
	}

	delete [] arr;
	arr = nullptr;

	return newArr;
}

// calcAvg - Takes in an interger pointer to an array, and the size of that array, then caclulates the average of all the numbers within the array.
double calcAvg(int* arr, int size)
{
	double sum = 0;
	double avg = 0;

	for (int j = 0; j < size; j++)
	{
		sum += arr[j];
	}

	avg = sum / size;
	return avg;
}

