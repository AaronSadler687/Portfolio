/*
* Name: Aaron Sadler
* Course: CSCI 3110-001
* Project: Proj4
* Due: 10/25/2021
* Overview: This is the implementation file for the
* maze.h header file. It implements the various functions
* needed for the FindExit feature.
*/

#include "maze.h"

using namespace std;

// Constructor for a Maze object
Maze::Maze()
{
	ifstream infile;						// Open File
	infile.open("maze.txt");

	infile >> xplor;						// Read the xplor numbers into the xplor string
	infile >> maxRows;						// Read the first number into max rows
	infile >> maxCols;						// Read the second number into max cols

	for (int i = 0; i < maxRows + 2; i++)
	{
		maze[i][0] = 'X';					// Create the left and right boundary
		maze[i][maxCols + 1] = 'X';
		for (int j = 0; j < maxCols + 2; j++)
		{
			maze[0][j] = 'X';				// Create the top and bottom boundary
			maze[maxRows + 1][j] = 'X';
		}
	}

	for (int i = 1; i <= maxRows; i++)
	{
		for (int j = 1; j <= maxCols; j++)
		{
			infile >> maze[i][j];			// Create the inner contents of the maze
		}
	}

	infile.close();							// Close the file

}

// Function that prints the maze WITHOUT the surronding X border
void Maze::Print()
{
	// Loop through the matrix printing each index
	cout << "Maze state:" << endl;
	for (int i = 1; i < maxRows + 1; i++)
	{
		for (int j = 1; j < maxCols + 1; j++)
		{
			cout << maze[i][j] << " ";				// Prints each character of the maze
		}
		cout << endl;
	}
}

// A recursive function that will call itself and explore the maze until the exit is found
void Maze::FindExit(int row, int col, bool& found)
{
	if (found != true && maze[row][col] != 'X' && maze[row][col] != '*')		// If the current pos is valid
	{
		cout << "Exploring " << row << ", " << col << endl;						// Print the node being explored
		if (maze[row][col] == 'E')												// If node is E, exit was found
		{
			found = true;
		}
																				// Otherwise, begin setting up for recursion
		else
		{
			maze[row][col] = '*';												// Leave our digital breadcrumb
			Print();															// Print the new maze picture
			
			for (int i = 0; i < 4; i++)											// Loop so you can go through all the various moves
			{
				if (found != true)												// Make sure the exit isn't found
				{
					pair<int, int> move = getMove(xplor[i]);					// Set move to the index i, of xplor
					FindExit(row + move.first, col + move.second, found);		// Recursivly call the function
				}
			}
		}
	}
}

// A function that when given a character between 1-4, will return a pair of offsets to use to determine the next
// move within the FindExit function.
pair<int, int> Maze::getMove(char c)
{
	// If the move is a 1, go up 1 row, and left 1 col
	if (c == '1')
	{
		int row_offset = -1, col_offset = -1;
		pair<int, int> move = make_pair(row_offset, col_offset);
		return move;
	}
	// If the move is a 2, go up 1 row, and right 1 col
	else if (c == '2')
	{
		int row_offset = -1, col_offset = 1;
		pair<int, int> move = make_pair(row_offset, col_offset);
		return move;
	}
	// If the move is a 3, go down 1 row, and right 1 col
	else if (c == '3')
	{
		int row_offset = 1, col_offset = 1;
		pair<int, int> move = make_pair(row_offset, col_offset);
		return move;
	}
	// If the move is a 4, go down 1 row, and left 1 col
	else if (c == '4')
	{
		int row_offset = 1, col_offset = -1;
		pair<int, int> move = make_pair(row_offset, col_offset);
		return move;
	}
}