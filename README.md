# miniFlow.ts
## A TypeScript port of Udacity's MiniFlow neural network framework

This is a TypeScript (=JavaScript) port of MiniFlow framework which is introduced in Udacity [Self Driving Car Nanodegree](https://www.udacity.com/course/self-driving-car-engineer-nanodegree--nd013) course.

This is a pet project, created in order to better understand the basics of neural networks.

## Build
The main TypeScript file (miniFlow.ts) is useable as-it-is, or can be compiled to JavaScript. You can use the provided `build.sh` script to compile.

## Framework Description

The framework is in the miniFlow.ts file. The file contains classes for neural network node, and functions for network actions.

### Node types

#### MfInput(value : number)
A simple input node. Gets a single real number value as a parameter.

Returns the value itself.

#### MfLinear(xNode: MfNode, w: MfNode, b: MfNode)
A linear node. Gets 3 input nodes as parameters:
* X value
* Weight paramer
* Bias parameter

Return the calculated value : w*x + b

#### MfCombine(nodeList : MfNode[])
An addition node. Gets a list of nodes, returns the sum of node values.

#### MfSigmoid(inputNode: MfNode)
A sigmoid function. Gets a single node as a parameter, returns 0..1 value. 

#### MfMSE(actualValueNode : MfNode, predictedValueNode : MfNode)
A Mean Squared Error function node. 
Gets 2 nodes as paramaters, and calculates the squared difference between the values.

### Network Action Methods

#### topologicalSort(nodeList : MfNode[])
Returns a topological sorted graph of nodes. Should be fed at least with the input nodes, but it is safer to feed every node.

#### forwardAndBackward(graph)
Runs a full forward and backward propagation cycle on a network. Gets a graph (returned by the `topologicalSort` method) as parameter.

#### forwardGraph(graph)
Runs only a forward propagation cycle. Can be used when predicting, so backward propagation is not needed.

#### sgdUpdate(trainables: MfInput[], learningRate: number)
Updates the values of trainable nodes. Trainable nodes should be only type of MfInput. 
Learning rate is the magnitude of learning on the gradient directions.



