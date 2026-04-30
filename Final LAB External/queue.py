class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None

class Queue:
    def __init__(self):
        self.front = None
        self.rear = None

    def enqueue(self, data):
        new_node = Node(data)
        if not self.front:
            self.front = new_node
            self.rear = new_node
        else:
            new_node.prev = self.rear
            self.rear.next = new_node
            self.rear = new_node

    def dequeue(self):
        if not self.front:
            raise Exception("Queue is empty")
        data = self.front.data
        if self.front == self.rear: 
            self.front = None
            self.rear = None
        else:
            self.front = self.front.next
            self.front.prev = None
        return data

    def is_empty(self):
        return self.front is None

    def peek(self):
        if not self.front:
            raise Exception("Queue is empty")
        return self.front.data

q = Queue()
q.enqueue(1)
q.enqueue(2)
q.enqueue(3)

print(q.dequeue())
print(q.peek()) 
print(q.is_empty()) 