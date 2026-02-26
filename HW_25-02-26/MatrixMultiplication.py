def add_matrices(A, B):
    n = len(A)
    return [[A[i][j] + B[i][j] for j in range(n)] for i in range(n)]

def divide_and_conquer_mult(A, B):
    n = len(A)

    if n == 1:
        return [[A[0][0] * B[0][0]]]

    mid = n // 2

    a11 = [row[:mid] for row in A[:mid]]
    a12 = [row[mid:] for row in A[:mid]]
    a21 = [row[:mid] for row in A[mid:]]
    a22 = [row[mid:] for row in A[mid:]]

    b11 = [row[:mid] for row in B[:mid]]
    b12 = [row[mid:] for row in B[:mid]]
    b21 = [row[:mid] for row in B[mid:]]
    b22 = [row[mid:] for row in B[mid:]]

    c11 = add_matrices(divide_and_conquer_mult(a11, b11), divide_and_conquer_mult(a12, b21))
    c12 = add_matrices(divide_and_conquer_mult(a11, b12), divide_and_conquer_mult(a12, b22))
    c21 = add_matrices(divide_and_conquer_mult(a21, b11), divide_and_conquer_mult(a22, b21))
    c22 = add_matrices(divide_and_conquer_mult(a21, b12), divide_and_conquer_mult(a22, b22))

    result = []
    for i in range(mid):
        result.append(c11[i] + c12[i])
    for i in range(mid):
        result.append(c21[i] + c22[i])

    return result

X = [[1, 2], [3, 4]]
Y = [[5, 6], [7, 8]]
print(divide_and_conquer_mult(X, Y))