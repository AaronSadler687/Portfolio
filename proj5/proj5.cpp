/*
* Name: Aaron Sadler
* Course: CSCI 3110-001
* Project: Proj5
* Due: 11/2/2021
* Overview: This is the main driver function for proj 5
* it reads two files, and stores input.txt into a word tree
* and then uses queries.txt to execute various actions on that
* word tree.
*/

#include "wordtree.h"
#include <fstream>
#include <algorithm>
#include <vector>


using namespace std;

// A function designed to split a string into a vector
void split(const std::string& s, char c, vector<string>& v) {

	std::string::size_type i = 0;
	std::string::size_type j = s.find(c);

	while (j != std::string::npos) {
		v.push_back(s.substr(i, j - i));
		i = ++j;
		j = s.find(c, j);

		if (j == std::string::npos)
			v.push_back(s.substr(i, s.length()));
	}
}

// The main driver function for proj5
int main()
{
	// Open files
	ifstream infile;
	infile.open("input.txt");

	ifstream queries;
	queries.open("queries.txt");

	// Declare local variables
	string str;
	char choice;
	int num;
	string word;
	
	// Create the WordTree object
	WordTree tree;

	// Createa a string vector
	vector<string> v;

	// Read the story into str
	getline(infile,str);

	// Make str all lowercase
	std::transform(str.begin(), str.end(), str.begin(), ::tolower);

	// Splits the str string by spaces and places each word in a vector<string>
	split(str, ' ',v);

	// Loop through the vector creating a wordtree with each word being added
	for (int i = 0; i != v.size(); i++)
	{
		tree.addWord(v[i]);
	}
	cout << "Word tree built and loaded" << endl;
	cout << endl;
	cout << endl;

	// Loop through the queries file and call and execute the corresponding functions, based on the choice.
	while (queries >> choice)
	{
		//queries >> choice;

		if (choice == 'C')
		{
			queries >> num;
			cout << "Finding all words with " << num << " or more occurrence(s)." << endl;
			tree.getCounts(num);
			cout << endl;
		}
		if (choice == 'F')
		{	
			queries >> word;
			cout << "Searching for occurrences of the word '" << word << "'" << endl;
			tree.findWord(word);
			cout << endl;
		}
	}

	// Close files
	infile.close();
	queries.close();

	// End of Main
	return -1;


}
