export class Matrix4 {
    public data = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    public toJSON(): number[] { return this.data; }
}
