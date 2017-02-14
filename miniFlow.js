"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MFNODE_KEY_COUNT = 0;
var NODE_MAP = {};
var MfNode = (function () {
    function MfNode(inboundNodes) {
        this.value = null;
        this.inboundNodes = inboundNodes;
        this.outboundNodes = [];
        this.gradients = {};
        this._key = MFNODE_KEY_COUNT;
        NODE_MAP[this._key] = this;
        MFNODE_KEY_COUNT++;
        for (var _i = 0, _a = this.inboundNodes; _i < _a.length; _i++) {
            var node = _a[_i];
            node.outboundNodes.push(this);
        }
    }
    MfNode.prototype.forward = function () { };
    MfNode.prototype.backward = function () { };
    return MfNode;
}());
exports.MfNode = MfNode;
var MfInput = (function (_super) {
    __extends(MfInput, _super);
    function MfInput(value) {
        var _this = _super.call(this, []) || this;
        _this.value = value;
        return _this;
    }
    MfInput.prototype.backward = function () {
        var gra = 0;
        for (var _i = 0, _a = this.outboundNodes; _i < _a.length; _i++) {
            var n = _a[_i];
            gra += n.gradients[this._key];
        }
        this.gradients[this._key] = gra;
    };
    return MfInput;
}(MfNode));
exports.MfInput = MfInput;
var MfLinear = (function (_super) {
    __extends(MfLinear, _super);
    function MfLinear(xNode, wNode, bNode) {
        var _this = _super.call(this, [xNode, wNode, bNode]) || this;
        _this.x = xNode;
        _this.w = wNode;
        _this.b = bNode;
        return _this;
    }
    MfLinear.prototype.forward = function () {
        this.value = this.x.value * this.w.value + this.b.value;
    };
    MfLinear.prototype.backward = function () {
        this.gradients[this.x._key] = 0;
        this.gradients[this.w._key] = 0;
        this.gradients[this.b._key] = 0;
        for (var _i = 0, _a = this.outboundNodes; _i < _a.length; _i++) {
            var n = _a[_i];
            var cost = n.gradients[this._key];
            this.gradients[this.x._key] += this.w.value * cost;
            this.gradients[this.w._key] += this.x.value * cost;
            this.gradients[this.b._key] += cost;
        }
    };
    return MfLinear;
}(MfNode));
exports.MfLinear = MfLinear;
var MfCombine = (function (_super) {
    __extends(MfCombine, _super);
    function MfCombine(nodeList) {
        var _this = _super.call(this, nodeList) || this;
        _this.nodeList = nodeList;
        return _this;
    }
    MfCombine.prototype.forward = function () {
        var v = 0;
        for (var _i = 0, _a = this.nodeList; _i < _a.length; _i++) {
            var n = _a[_i];
            v += n.value;
        }
        this.value = v;
    };
    MfCombine.prototype.backward = function () {
        for (var _i = 0, _a = this.nodeList; _i < _a.length; _i++) {
            var inBoundNode = _a[_i];
            this.gradients[inBoundNode._key] = 0;
        }
        for (var _b = 0, _c = this.outboundNodes; _b < _c.length; _b++) {
            var n = _c[_b];
            var cost = n.gradients[this._key];
            for (var _d = 0, _e = this.nodeList; _d < _e.length; _d++) {
                var inBoundNode = _e[_d];
                this.gradients[inBoundNode._key] += cost;
            }
        }
    };
    return MfCombine;
}(MfNode));
exports.MfCombine = MfCombine;
var MfSigmoid = (function (_super) {
    __extends(MfSigmoid, _super);
    function MfSigmoid(inputNode) {
        var _this = _super.call(this, [inputNode]) || this;
        _this.x = inputNode;
        return _this;
    }
    MfSigmoid.prototype.forward = function () {
        this.value = 1 / (1 + Math.exp(-1 * this.x.value));
    };
    MfSigmoid.prototype.backward = function () {
        this.gradients[this.x._key] = 0;
        for (var _i = 0, _a = this.outboundNodes; _i < _a.length; _i++) {
            var n = _a[_i];
            var cost = n.gradients[this._key];
            this.gradients[this.x._key] += this.value * (1 - this.value) * cost;
        }
    };
    return MfSigmoid;
}(MfNode));
exports.MfSigmoid = MfSigmoid;
var MfMSE = (function (_super) {
    __extends(MfMSE, _super);
    function MfMSE(actualValueNode, predictedValueNode) {
        var _this = _super.call(this, [actualValueNode, predictedValueNode]) || this;
        _this.a = actualValueNode;
        _this.y = predictedValueNode;
        return _this;
    }
    MfMSE.prototype.forward = function () {
        var mse = Math.pow((this.a.value - this.y.value), 2);
        this.value = mse;
    };
    MfMSE.prototype.backward = function () {
        this.gradients[this.a._key] = this.y.value - this.a.value;
        this.gradients[this.y._key] = -1. * (this.y.value - this.a.value);
    };
    return MfMSE;
}(MfNode));
exports.MfMSE = MfMSE;
function topologicalSort(nodeList) {
    var G = {};
    var L = [];
    var nl = [];
    for (var _i = 0, nodeList_1 = nodeList; _i < nodeList_1.length; _i++) {
        var n = nodeList_1[_i];
        nl.push(n);
    }
    while (nl.length > 0) {
        var n_1 = nl.pop();
        if (G[n_1._key] == undefined) {
            G[n_1._key] = { "in": {}, out: {} };
        }
        for (var _a = 0, _b = n_1.outboundNodes; _a < _b.length; _a++) {
            var m = _b[_a];
            if (G[m._key] == undefined) {
                G[m._key] = { "in": {}, out: {} };
            }
            G[m._key]['in'][n_1._key] = 1;
            G[n_1._key]['out'][m._key] = 1;
            nl.push(m);
        }
    }
    for (var _c = 0, nodeList_2 = nodeList; _c < nodeList_2.length; _c++) {
        var n = nodeList_2[_c];
        nl.push(n);
    }
    while (nl.length > 0) {
        var n_2 = nl.pop();
        L.push(n_2);
        for (var _d = 0, _e = n_2.outboundNodes; _d < _e.length; _d++) {
            var m = _e[_d];
            delete G[m._key]['in'][n_2._key];
            delete G[n_2._key]['out'][m._key];
            if (Object.keys(G[m._key]['in']).length == 0) {
                nl.push(NODE_MAP[m._key]);
            }
        }
    }
    return L;
}
exports.topologicalSort = topologicalSort;
function forwardGraph(graph) {
    for (var _i = 0, graph_1 = graph; _i < graph_1.length; _i++) {
        var n = graph_1[_i];
        n.forward();
    }
}
exports.forwardGraph = forwardGraph;
function forwardAndBackward(graph) {
    forwardGraph(graph);
    for (var i = graph.length - 1; i >= 0; i--) {
        graph[i].backward();
    }
}
exports.forwardAndBackward = forwardAndBackward;
function sgdUpdate(trainables, learningRate) {
    for (var _i = 0, trainables_1 = trainables; _i < trainables_1.length; _i++) {
        var tra = trainables_1[_i];
        for (var key in tra.gradients) {
            tra.value += tra.gradients[key] * learningRate;
        }
    }
}
exports.sgdUpdate = sgdUpdate;
