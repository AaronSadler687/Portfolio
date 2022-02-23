# Name: Aaron Sadler
# Lab: OLA1
# Course: CSCI 3130-001
# School: MTSU
# Professor: Arpan Sainju


.global main
.text


main:
	# Store the first element of the array into rax
	mov $0, %rbx				# Place 0 into rbx, this will be our count for the array
loop:	
	mov %rbx, %r15				# Place the current value of rbx into r15
	mov Array(, %r15, 8), %rdi		# Places Array[r10], into rdi
	inc %r15				# Increment r15 in order to grab the 3 numbers after the current index
        mov Array(, %r15, 8), %rsi              # Places Array[r10], into rsi
	inc %r15                                # Increment r15 in order to grab the 3 numbers after the current index
        mov Array(, %r15, 8), %rdx              # Places Array[r10], into rdx
	inc %r15                                # Increment r15 in order to grab the 3 numbers after the current index
        mov Array(, %r15, 8), %rcx              # Places Array[r10], into rcx
        inc %rbx                                # Increment rbx by 1 (our array position)

	push %rdi				# Place rdi onto the stack
	push %rsi                               # Place rsi onto the stack
	push %rdx                               # Place rdx onto the stack
	push %rcx                               # Place rcx onto the stack
	
	call multi				# Peform the math using the variables, by calling multii

	pop %rcx                                # Pop rcx off the stack
	pop %rdx                                # Pop rdx off the stack
	pop %rsi                                # Pop rsi off the stack
	pop %rdi                                # Pop rdi off the stack
	
	# Print the current itteration
	
	mov %rdi, %r9				# Temp place rdi (W) into r9

	mov $print_string, %rdi			# Place print string into rdi (arg1)
	mov %rsi, %r8				# Temp store rsi (x) into r8
	mov %r9, %rsi				# Places W to final print spot

	mov %rdx, %r9				# Temp places rdx (Y) into r9
	mov %r8, %rdx				# Places X into final print spot
	
	mov %rcx, %r8				# Places Z into final print spot
	mov %r9, %rcx				# Places Y into final print spot

	mov %rax, %r9				# Places the Sum into final print spot
	
	mov $0, %rax				# Set rax to 0
	call printf

	cmp $13, %rbx				# Test if the array counter is 13, if it is, then the array has been navigated
	je done					# Exit loop
	jmp loop				# Otherwise, loop again
done:
	# Exit the program
	ret
	

# Multi function takes in 4 numbers, and then does (W*x)-(Y/Z), storing the result into RAX
# Multi(rdi,rsi,rdx,rcx) -> Multi(w,x,y,z)
multi:
	mov %rdx, %r13		# Store y into r13, so it can be used later

	mov %rsi, %rax		# Place X into rax in order to prepare for multiplication
	mul %rdi		# %RDX:RAX = %rax * %rdi | Multiply RAX (x), by RCX (w), stored into RDX:RAX
	
	mov %rax, %r14		# Store the product into r14, to free up rdx for divison
	
	mov %r13, %rax		# Place Z into rax, to prep for divison
	mov $0, %rdx		# Place 0 into rdx to prep for divison
	div %rcx		# Divide y by z (%r13 / %rax), stored in RAX, remainder is in rdx

	mov %rax, %r12		# Temporarily place the quotient into r12
	mov %r14, %rax		# Place the product into rax
	sub %r12, %rax		# %rax = %rax - %r12 | Subrtract the product by the quotient by subtracting rax by r12, stored into rax
	
	

	ret			# Exit multi
	

.data

Array: .quad 2,3,4,2,16,2,50,10,100,20,1000,20,23,45,12,12		# A quad array of 16 values
print_string: .ascii "(%d * %d) - (%d / %d) = %d\n\0"			# The formatting of a string for the print f function
