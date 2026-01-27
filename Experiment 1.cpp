#include <bits/stdc++.h>
using namespace std;

void complexRec(int n)
{
    int op;
    if (n <= 2)
    {
        op++;
        return;
    }

    int p = n;

    while (p > 0)
    {
        vector<int> temp(n);
        op++;
        for (int i = 0; i < n; i++)
        {
            op++;
            temp[i] = i ^ p;
        }
        p >>= 1;
    }

    vector<int> small(n);

    for (int i = 0; i < n; i++)
    {
        op++;
        small[i] = i * i;
    }

    if (n % 3 == 0)
    {
        op++;
        reverse(small.begin(), small.end());
    }
    else
    {
        op++;
        reverse(small.begin(), small.end());
    }

    complexRec(n / 2);
    complexRec(n / 2);
    complexRec(n / 2);
}

int main(){
    int n;
    int op;
    cin>>n;
    complexRec(n);
    cout<<op;
}
