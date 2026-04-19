import bpy
obj = bpy.context.object
mesh = obj.data
file = open("\\home\\guilherme\\Desktop\\Javascript\\python-test\\vertices.json", "w")

#file.write("[")
i = 0
i2 = 0
#vert in mesh.vertices
for face in mesh.polygons:
    i += 1
    i2 += 1
    #xyz = vert.co.xyz
    if i2 == 1:
        file.write("[")
    file.write(f"[{face.vertices[0]}, {face.vertices[1]}, {face.vertices[2]}]")
    if i2 == 3:
        file.write("]")
        if len(mesh.vertices) > i:
            file.write(",\n")
        i2 = 0
    else:
        file.write(", ")

#file.write("]\n")