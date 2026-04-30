nums = [10, 9, 2, 5, 6, 101, 18]

if not nums:
    print(0)

dp, indices = [], []

for num in nums:
    if not dp or num > dp[-1]:
        dp.append(num)
        indices.append(len(dp) - 1)
    else:
        left, right = 0, len(dp) - 1
        while left < right:
            mid = (left + right) // 2
            if dp[mid] >= num:
                right = mid
            else:
                left = mid + 1
        dp[right] = num

print(len(dp))
