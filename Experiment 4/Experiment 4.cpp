#include <bits/stdc++.h>
using namespace std;

#define MAX 100
int heap[MAX];
int heapSize = 0;

void heapifyDown(int i)
{
    int smallest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (left < heapSize && heap[smallest] > heap[left])
        smallest = left;
    if (right < heapSize && heap[smallest] > heap[right])
        smallest = right;
    if (smallest != i)
    {
        swap(heap[i], heap[smallest]);
        heapifyDown(smallest);
    }
}

void heapifyUp(int i)
{
    while (i > 0 && heap[(i - 1) / 2] > heap[i])
    {
        swap(heap[(i - 1) / 2], heap[i]);
        i = (i - 1) / 2;
    }
}

int search(int val)
{
    for (int i = 0; i < heapSize; i++)
    {
        if (heap[i] == val)
            return i;
    }
    return -1;
}

void deleteAnyNode(int val)
{
    int index = search(val);
    if (index == -1)
    {
        cout << "Element " << val << " not found!" << endl;
        return;
    }

    heap[index] = heap[heapSize - 1];
    heapSize--;

    if (index < heapSize)
    {
        heapifyDown(index);
        heapifyUp(index);
    }
    cout << "Deleted " << val << endl;
}

void insert(int val)
{
    if (heapSize == MAX)
    {
        cout << "overflow";
        return;
    }
    heap[heapSize] = val;
    heapSize++;
    heapifyUp(heapSize - 1);
}

int main()
{
    insert(10);
    insert(20);
    insert(30);
    insert(40);
    insert(50);

    for (int i = 0; i < heapSize; i++)
        cout << heap[i] << " ";
    cout << endl;

    int s = 30;
    int i = search(s);
    if (i != -1)
        cout << "Found " << s << " at index " << i << endl;

    deleteAnyNode(20);

    for (int i = 0; i < heapSize; i++)
        cout << heap[i] << " ";

    return 0;
}
