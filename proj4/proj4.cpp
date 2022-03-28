/*
* Name: Aaron Sadler
* Course: CSCI 3110-001
* Project: Proj4
* Due: 10/25/2021
* Overview: This is the driver file for proj4.
* It calls the FindExit function, and prints out
* if the exit to the maze it created was found or
* not.
*/
#include <iostream>
#include "maze.h"

using namespace std;

int main()
{
	Maze m;
	bool found = false;

	m.Print();
	cout << "Start postion: " << "1" << ", " << "1" << endl;					// Print the start location
	m.FindExit(1, 1,found);

	if (found == true)
	{
		cout << "Found exit!" << endl;
	}
	else
	{
		cout << "No exit!" << endl;
	}

	return -1;
}