/*
* Name: Aaron Sadler
* Course: CSCI 3110-001
* Project: Proj3
* Due: 10/4/2021
* Overview: This is the main function for proj3, it takes the 
* card class and uses it to create a deck of cards and manipulate them
* based on the input read in via cards.txt
*/
#include <fstream>
#include "tsllist.h"
#include "card.h"

using namespace std;

int main()
{
	ifstream inFile;					// Create a file stream
	inFile.open("cards.txt");			// Open the file

	TSLList<Card> list;
	

	int s;								// Variable for reading the suit from the file
	int face;							// Variable for reading the faceValue from the file
	char letter;						// Variable for reading the letter from the file
	Card x = Card();


	while (inFile >> s)				// While the file has content
	{
		inFile >> face;				// Read the letter after the number
		inFile >> letter;

		suit newSuit = static_cast<suit>(s);

		x = Card(face, newSuit);

		cout << letter << " " << x << endl;

		if (letter == 'a')				// Add the int to the SLL
		{
			list.insertInOrder(x);
			list.printAll();
		}
		if (letter == 'd')				// Remove the int from the SLL
		{
			cout << "Removed " << list.deleteVal(x) << endl;
			list.printAll();
		}
		if (letter == 'D')				// Delete the SLL
		{
			list.deleteAllVal(x);
			list.printAll();
		}
	}

	inFile.close();

	return 0;							// End of Main
}

