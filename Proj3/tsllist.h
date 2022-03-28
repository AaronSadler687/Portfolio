// Based on code from Figure 3.2, on pages 78-80, of the 4th
// edition of Data Structures and Algorithms in C++ by Adam Drozdek
//
// Heavily modified by Dr. Sal Barbosa, Middle Tennessee State University,
// for the purposes of a programming assignment
//
//************************  TSLList.h  **************************
//       singly-linked list class to store integers in order
/*
* Name: Aaron Sadler
* Course: CSCI 3110-001
* Project: Proj3
* Due: 10/4/2021
* Overview: This is the main functions of the tsllist class and their
* defintions.
*/

#ifndef T_LINKED_LIST
#define T_LINKED_LIST

#include <iostream>

using namespace std;

template <class T>
class TSLList {
public:

	// Constructor
	TSLList() {
		head = nullptr;
	}

	//D Destructor
	~TSLList() {
		clearList();
	}

	// prints the info content and address of each node in the list
	void printAll() const {
		for (TSLLNode* tmp = head; tmp != nullptr; tmp = tmp->next)
			std::cout << "->" << tmp->info;
		std::cout << std::endl;
	}

	// Inserts node in order (see assignment specification for details)
	void insertInOrder(T num)
	{
		TSLLNode* node = new TSLLNode(num);				// Create a new node
		TSLLNode* prev = nullptr;									// Create a pointer to a previous node in the list
		TSLLNode* curr = head;								// Create a pointer to the next node in the list
		// If head = nullptr, than no list exist, set head to node.
		if (head == nullptr)
		{
			head = node;
		}
		else if (node->info <= head->info)
		{
			node->next = head;
			head = node;
		}
		// Otherwise check if the head node is bigger or smaller than the intial node.
		else
		{
			while (curr != nullptr && curr->info < node->info)
			{
				prev = curr;
				curr = curr->next;
			}
			prev->next = node;
			node->next = curr;

		}
	}

	// Deletes an occurrence of argument (see assignment specification for details)
	T deleteVal(T val)
	{
		TSLLNode* prev = nullptr;			// Create a pointer to a previous node in the list
		TSLLNode* curr = head;				// Create a pointer to the next node in the list
		T ret = T();						// A template variable to hold the value that will be returned
		// If curr is within the list and the value, the head pointer is the value, delete it
		if (curr != nullptr && curr->info == val)
		{
			head = curr->next;
			ret = curr->info;
			delete curr;
			return ret;
		}
		// Otherwise
		else
		{
			// Loop until curr->info IS the value or the list ends
			while (curr != nullptr && curr->info != val)
			{
				prev = curr;
				curr = curr->next;
			}
			// If the list ended without finding the value, return the default constructor
			if (curr == nullptr)
			{
				return ret;
			}
			// Otherwise, delete the value and return it
			prev->next = curr->next;
			ret = curr->info;
			delete curr;
			return ret;
		}
	}

	// Deletes all occurrences of argument (see assignment specification for details)
	void deleteAllVal(T el)
	{
		TSLLNode* tmp = nullptr;			// A node pointer to naviagate the list with
		TSLLNode* prev = nullptr;					// A node pointer to the node after tmp
		TSLLNode* curr = head;					// A node pointer to the node after tmp					

		// If the head node contains the element...
		if (head->info == el)
		{
			// Loop until head no longer contains that element
			while (head->info == el)
			{
				cout << "The head was ran" << endl;
				tmp = head;
				head = head->next;
				delete tmp;
				tmp = nullptr;
			}
		}
		else
		{
			prev = curr;
			while (curr != nullptr)
			{
				//cout << curr->info << endl;
				if (curr->info == el)
				{
					while (curr != nullptr && curr->info == el)
					{
						//cout << curr->info << endl;
						tmp = curr;
						curr = curr->next;
						delete tmp;
						tmp = nullptr;
					}
					//cout << "The loop was left" << endl;
					prev->next = curr;
				}
				else
				{
					prev = curr;
					curr = curr->next;
				}
			}
		}
	}

	// Clears the list (deallocates memory - see assignment specification for details)
	void clearList()
	{
		TSLLNode* curr = head;			// A node pointer for the next node
		TSLLNode* tmp = nullptr;					// A node pointer for the previous node
		// While the next node is not null loop through the list deleting node by node.
		while (curr != nullptr)
		{
			tmp = curr;
			curr = curr->next;
			cout << "Deleting " << tmp->info << endl;
			delete tmp;
			tmp = nullptr;
		}
	}

private:
	struct TSLLNode {
		TSLLNode(T el = T()) {
			info = el;
			next = nullptr;
		}
		T info;
		TSLLNode* next;
	};
	TSLLNode* head;	// head of the list
};

#endif
