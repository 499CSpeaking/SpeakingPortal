#include <stdio.h>
int main(){
  
  const int n = 100000 ;// 10 million
  double a[n];
  for (int i = 0; i < n; i++)
      a[i] = (double)i / n;

  printf("a[%d]: %.7f", (0) , a[0]);
  printf("a[%d]: %.7f", (1) , a[1]);
  printf("a[%d]: %.7f", (2) , a[2]);
  printf("a[%d]: %.7f", (3) , a[3]);
  printf("a[%d]: %.7f", (4) , a[4]);


  printf("a[%d]: %.7f", (n-5) , a[n-5]);
  printf("a[%d]: %.7f", (n-4) , a[n-4]);
  printf("a[%d]: %.7f", (n-3) , a[n-3]);
  printf("a[%d]: %.7f", (n-2) , a[n-2]);
  printf("a[%d]: %.7f", (n-1) , a[n-1]);
}