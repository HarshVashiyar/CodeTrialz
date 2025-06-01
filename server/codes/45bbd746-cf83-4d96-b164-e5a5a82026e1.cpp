#include<iostream>
using namespace std;

int main()
{
    int n;
    scanf("%d",&n);
    if(n%2==1)
    printf("NO\n");
    else
    {
        if(n==2) printf("NO\n");
        else printf("YES\n");
    }
}