class Solution:
    def maxOfSubarrays(self, arr, k):
        l, r = 0, k
        currMax = max(arr[l:r])
        res = [currMax]

        while r < len(arr):
            if arr[r] > currMax:
                currMax = arr[r]
            elif arr[l] == currMax:
                currMax = max(arr[l+1:r+1])

            res.append(currMax)

            l += 1
            r += 1

        return res