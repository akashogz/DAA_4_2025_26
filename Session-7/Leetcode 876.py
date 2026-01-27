# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:
        t1 = t2 = head
        c = 0 
        while t1 is not None:
            c += 1
            t1 = t1.next

        b = c//2
        while (b>0):
            t2 = t2.next
            b -= 1
        return t2