Objectives: 1) Use recursion; 2) Understand and apply backtracking to solve a problem. 

Overview: Make a program that given a starting point, finds its way tot he exit of the maze using recursion. 
The map is a rectangular grid represented as a 2D standard C++ Array composed of characters. X cells are not able to be traversed
, and are the barriers of the maze. E marks the exit.

Requirements: For each instance, print the current map and the position being searched. The first instance should also print the starting position.
The program must find the exit EXLUSIVLY using backtracking and recursive calls, and NOT by looking ahead.

Functions:
The constructor will open and read the input file and construct the maze. The input file is named
maze.txt.The file contains a rectangular maze no larger than 8 cells by 8 cells - your code
must be able to handle all mazes from those having a minimum of two rows (2x1) or
two columns (1x2) up to the maximum 8x8 (error checking is not required). The first line in the
file is the exploration order: a string containing the characters N,S,E,W in any order. The next
line holds the dimensions of the maze (# of rows followed by # of columns, separated by a
space). The remainder of the file is the maze play area. An example maze file (4
rows by 5 columns) is shown below. Note: There are no spaces between cell legend symbols in
the file. 
The Print() function outputs the maze’s current state. It must only be output in unvisited
traversable cells. See sample output.
 The FindExit() function is a void recursive function that explores the maze. It has two int
parameters indicating the player’s row and column (in that order), and a bool reference variable
that represents whether or not the treasure has been found. The exploration of the treasure
maze will always begin at row 1, column 1 (which must be a land cell). This function must rely on
recursion to explore the maze and to backtrack. You MAY NOT use a return or break statement
in it. Write the code so that it backtracks naturally. Hint: To keep code streamlined, do not
write special case code to handle boundary cells. Simply backtrack out of them.
 The getMove() function, has a single char parameter (an element of the xplor string). It returns
a std::pair of two ints. The first is the row offset [-1 (go up one row), 1 (go down one row), or 0
(stay in same row)], and the second the column offset [-1 (go left one column), 1 (go right one
column), or 0 (stay in same column)]. Here’s an example of how to declare and set a pair:
int row_offset = 0, col_offset = 1; // row_offset and col_offset make up the pair
std::pair<int,int> move = std::make_pair(row_offset, col_offset); // move is the variable name
Here’s an example of how to use move: if the player is currently in cell 3, 4 and getMove
returns the pair (0, 1), the player will proceed to cell 3, 5 (3+0, 4+1). 
