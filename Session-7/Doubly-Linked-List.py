class Node:
    def __init__(self, data):
        self.data = data
        self.prev = None
        self.next = None


head = None


def insert(data):
    global head
    new = Node(data)

    if head is None:
        head = new
        return

    temp = head
    while temp.next:
        temp = temp.next

    temp.next = new
    new.prev = temp


def display():
    temp = head
    while temp:
        print(temp.data, end=" <-> ")
        temp = temp.next
    print("NULL")


def delete_front():
    global head
    if head is None:
        print("List empty")
        return

    head = head.next
    if head:
        head.prev = None


insert(10)
insert(20)
insert(30)

display()

delete_front()

display()
