# Wasp
Wasp is a programming language made for code-golfing via an interpreter written in JavaScript.

## What is code golf?
From Wikipedia:
> **Code golf** is a type of recreational computer programming competition in which participants strive to achieve the shortest possible source code that implements a certain algorithm. Playing code golf is known as "golf scripting".

## Running locally
- Requires NodeJS to be installed
```
npm start
```

# Documentation
Wasp first loads the Artifacts (input values separated by a newline).
### Example artifact list
```
12
My String
true
```

## Commands
```
;>      Create a new variable (Left-hand side)
            -Variables are accessed by their order/index
            -The first index is 0

_X|     Access the artifact list at the index X
            -The first artifact index is 0

@X|     Access a global (a built-in variable)
            -Globals cannot be modified at runtime

!       Print the preceeding token with a newline ("\n" appending at the end)
!!      Print the preceeding token (without an appended newline)

;<      Delete the variable at the current index
            -The index is decremented by 1

[>]     Increment the current variable index
            -Multiple '>' symbols to shift the index several times ex. [>>>] shifts the index forwards 3 times
            -If used on the right side of an operation, use it as a reference instead and do not change the current variable index

[<]     Decrement the current variable index
            -works as [>] in the reverse order
            -ex. [<<<<] shifts the variable index -4 times

?       Resets the variable index to 0

$       Access the current variable (Right or left side of operation)

$+      Increment the current variable (if it is a number)
$-      Decrement the current variable (if it is a number)

$++     Add the preceeding token to the current varaible
$--     Subtract the preceeding token from the current variable
            -ex. $--_0|
            -ex. $++[>]

#       Start an if statement -- the condition is the current variable
##      Start an if not statement -- the condition is the current variable

^       Start/end a loop
            -structured like a "do-until" loop

'       The multiplication operator
"       The division operator
~       The distance operator (absolute value of 'x - y')

''      The repeat operator (repeats the left times the right (a number))

%       The ID operator (returns a hash code '0xXXXXX' of the current variable)

/       Restart the function or program

//      Exit the function or program
```

## Globals
```
Globals (built-in variables)
0.	true
1.	false
2.  0
3.	1 
4.	10 
5.	" "
6.	"\n" 
7.	","
8.	-1
9.	10
10.	2
```

## Tutorials
Refer to the `public/examples.txt` for example Wasp scripts.

# License
MIT