Overview: Develop an x86_64 assembly language program that uses a function and a loop to calculate values across an array.



For this assignment you must write all code in x86_64 assembly (but you may use/call C functions in your assembly code).
All code should be in one source file only (asm_program.asm)
You may reuse code from any of my assembly examples for this assignment.
Create a function which takes four 64-bit integer arguments (eg. W, X, Y, Z).
Your function should compute (W * X) - (Y / Z), and leave the result in RAX when it returns.
Your function should accept the four arguments using appropriate conventions (see registers listed in the lecture slides).
Your function should NOT print anything - it should ONLY perform the math, and return the result via RAX.
Use a loop to compute the above function over an array of size 16 (A[0], A[1], ..., A[15])
Declare an array (in memory) containing 16 reasonable 64-bit integer values (of your choosing, but avoid using zero).
Use a loop to iterate over the elements of the array, and use your function (above) to calculate the value of every four consecutive array values.
For example,
rax = (A[0] * A[1]) - (A[2] / A[3]), then
rax = (A[1] * A[2]) - (A[3] / A[4]), then
rax = (A[2] * A[3]) - (A[4] / A[5]), then
...
...
...
rax = (A[12] * A[13]) - (A[14] / A[15])
done
For each iteration, print out the calculation, the result, and start a newline (exactly in this form): (5 * 2) - (4 / 3) = 9
The last iteration should compute rax = (A[12] * A[13]) - (A[14] / A[15]) ... (i.e. don't calculate past the end of the array!)
Compile and link your code to make an executable (asm_program)
Use insightful comments in the code to illustrate what is happening at each step
The assembly source code file should be named "asm_program.asm"
The executable file should be named "asm_program"
There should not be any folder within the zip file. The zip file should only contain two files: "asm_program.asm" and "asm_program"
Your function should take exactly four arugments
Include a header with the relevant information for assignments as defined in the syllabus
Read the submission requirements in the syllabus before submitting your work for grading
