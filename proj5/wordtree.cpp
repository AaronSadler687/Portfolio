/*
* Name: Aaron Sadler
* Course: CSCI 3110-001
* Project: Proj5
* Due: 11/2/2021
* Overview: This is the implementation file for
* wordtree.h, it implements all the needed functions
* both private and public, for the wordtree.h file.
*/

#include "wordtree.h"

using namespace std;

// The constructor for the WordTree class, it sets the root to nullptr
WordTree::WordTree()
{
	root = nullptr;
}

// The deconstructor for WordTree class, it deletes the entire tree, freeing memory.
WordTree::~WordTree()
{
	deleteSubTree(root);
}

// A function that when given a word, adds it to the binary tree, refered to as the word tree
void WordTree::addWord(TreeNode*& node, string word)
{
	// If no tree currently exist
	if (node == nullptr)
	{
		node = new TreeNode();
		root = node;
		node->value = word;
		node->count = 1;
		node->left = nullptr;
		node->right = nullptr;
	}
	// Nodes value is the word, so just increment node's count and exit the function.
	if (node->value == word)
	{
		node->count++;
	}
	// Traverse the tree and recursivly call the function after traversing in the correct direction
	else if (node->value != word && node != nullptr)
	{
		// If word is less than node's value
		if (word < node->value)
		{
			// and word is null
			if (node->left == nullptr)
			{
				// Create a new left child for node, and set it's value to word
				node->left = new TreeNode();
				node->left->value = word;
				node->left->count = 1;
			}
			// Otherwise, recrusivally call this function using the current node's left node
			else
			{
				addWord(node->left, word);
			}
		}
		// Otherwise word is greater than node's value
		else if (word > node->value)
		{
			// Create a new right child for node, and set it's value to word
			if (node->right == nullptr)
			{
				node->right = new TreeNode();
				node->right->value = word;
				node->right->count = 1;
			}
			// Otherwise, recrusivally call this function using the current node's right node
			else
			{
				addWord(node->right, word);
			}
		}
	}

}

// A function that calls the private addWord function
void WordTree::addWord(string word)
{
	//cout << "addword was called" << endl;
	addWord(root, word);
}

// A function that traverses the tree and searches for the word it is passed in, it then returns it's count
// Or prints that it is not in the word tree
void WordTree::findWord(string word)
{
	// Set curr to root
	TreeNode* curr = root;
	bool found = false;

	// While curr isn't null, and the word hasn't been found, loop
	while (curr != nullptr && found != true)
	{
		// If the word is less than curr's current word
		if (word > curr->value)
		{
			// Set curr to curr's right child
			curr = curr->right;
		}
		// Otherwise, if curr is greater than curr's current word
		else if (word < curr->value)
		{
			// Set curr to curr's left child
			curr = curr->left;
		}
		// Otherwise, if curr IS the word, print.
		else if (curr->value == word)
		{
			cout << "The word '" << word << "' occurs " << curr->count << " time(s) in the text." << endl;
			found = true;
		}
	}

	// If found is false, the word is not within the word tree.
	if(found == false)
	{
		cout << "The word '" << word <<"' was not found in the text." << endl;
	}
}

// A function that takes in a tree node, and number, and returns by refrence a
// accumlated count of words that meet the threshold count | PVT
void WordTree::getCounts(TreeNode* node, int num, int& sum) const
{
	// If node is not null
	if (node != nullptr)
	{
		// Recursivally call this function using the left node of node (traverses the left subtree)
		getCounts(node->left, num, sum);

		// If the count is greater than or equal to the num, increase the accumulatore, and print it.
		if (node->count >= num)
		{
			cout << node->value <<" (" << node->count << ")" << endl;
			sum++;
		}

		// Recursivally call this function using the right node of node (traverses the right subtree)
		getCounts(node->right, num, sum);
	}
}

//  A function that sets up and calls the PVT getCounts, then prints the results
void WordTree::getCounts(int num)
{
	// Set node to root
	TreeNode* node = root;
	int count = 0;

	//Call the private version of get counts using num, count, and root
	getCounts(node, num, count);

	//print
	cout << count << " nodes had words with " << num << " or more occurrence(s)." << endl;
}

// Recusive function that deletes the word tree | PVT
void WordTree::deleteSubTree(TreeNode* node)
{
	if (node != nullptr)
	{
		// Recursivlly delete the left subtree
		deleteSubTree(node->left);
		// Recursivlly delete the right subtree
		deleteSubTree(node->right);
		// Delete the current node
		delete node;
	}
}