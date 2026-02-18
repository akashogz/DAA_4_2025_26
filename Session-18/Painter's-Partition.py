class Solution:
    def minTime (self, arr, k):
        l, r = max(arr), sum(arr)
        ans = 0
        
        while l <= r:
            mid = (l + r) // 2
            
            if self.canPaint(arr, mid, k):
                r = mid - 1
                ans = mid
            else:
                l = mid + 1
        
        return ans
            
    def canPaint(self, arr, mid, k):
        painted = 0
        count = 1
        
        for a in arr:
            if painted + a > mid:
                count += 1
                painted = a
            else:
                painted += a
        
        if count <= k:
            return True
        else:
            return False