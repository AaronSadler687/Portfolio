#ifndef WORDTREE_H
#define WORDTREE_H

#include<iostream>
#include<string>

class WordTree
{
private:
    struct TreeNode
    {
        std::string value;        // The value in the node
        TreeNode* left;    		// Pointer to left child node
        TreeNode* right;   		// Pointer to right child node
        int count;				// Instance count of value
    };

    TreeNode* root;       // Pointer to the root node

    // Private member functions - all are recursive
    void addWord(TreeNode*&, std::string);			// reference to pointer to node, and word to be added
    void deleteSubTree(TreeNode*);					// pointer to node
    void getCounts(TreeNode*, int, int&) const;		// pointer to node, int threshold, 
                                                    // reference to int that accumulates nodes that meet the query


public:
    // Constructor
    WordTree();

    // Destructor - invokes helper function
    ~WordTree();

    // public functions via which the tree operations are called (hides tree's root/implementation) 
    void addWord(std::string);
    void findWord(std::string);
    void getCounts(int);

};
#endif