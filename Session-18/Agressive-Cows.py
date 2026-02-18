class Solution:
    def aggressiveCows(self, stalls, k):
        temp = sorted(stalls)
            
        l, h = 1, temp[-1] - temp[0]
        ans = 0    
            
        while l <= h:
            mid = (l + h) // 2
            
            if self.canPlace(temp, k, mid):
                ans = mid
                l = mid + 1
            else:
                h = mid - 1
        return ans
            
    def canPlace(self, arr, k, mid):
        last = arr[0]
        count = 1
        
        for a in range(1, len(arr)):
            if arr[a] - last >= mid:
                last = arr[a]
                count += 1
                
                if k == count:
                    return True
        
        return False