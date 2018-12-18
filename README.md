# Factory Nodes and Sockets

Live demo: https://arcane-woodland-73099.herokuapp.com/ (best when multiple tabs are open)

* The tree contains a group of nodes, with a main (root) node that can have any number of ‘factories’. 
* These factory nodes can in turn generate a set amount of random numbers (up to 15), represented as child nodes of their respective factories. 
* Factories and children are created through user input specifying the number of children to generate (up to 15) and the ranges of those children. 
* Factories have an adjustable name assigned to them, are removable, and have an adjustable lower and upper bound for the random number generation. 
* All users can see any changes made to the tree immediately across browsers without refreshing or polling. 
* The state of the tree remains persistent; reloading does not undo any state. 
* All of a factory’s existing child nodes are removed upon each new generation. 
* This project validates inputs and is secure.
