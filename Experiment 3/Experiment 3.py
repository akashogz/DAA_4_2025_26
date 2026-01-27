n = int(input())

att = []
while len(att) < n:
    att.extend(input().split())

imap = {0: -1}
currsum = 0
maxwindow = 0

for i in range(n):
    if att[i] == "P":
        currsum += 1
    else:
        currsum -= 1

    if currsum in imap:
        window = i - imap[currsum]
        maxwindow = max(maxwindow, window)
    else:
        imap[currsum] = i

print(maxwindow)