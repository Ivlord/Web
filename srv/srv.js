let a={'q':[10,20], 'iv':[30,40]}, b={}
for (const [key, value] of new URLSearchParams(window.location.search)) {
    if (key in a && a[key][0]==value) b[key]=a[key][1]
}
document.write(JSON.stringify(b))

