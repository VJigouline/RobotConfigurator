import { Point3 } from './point3';
import { Vector3 } from './vector3';
import { Matrix4 } from './matrix4';

export class Transform3 {
    public static get Identity(): Transform3 {
        return new Transform3 (
            new Point3(0, 0, 0),
            new Vector3(1, 0, 0),
            new Vector3(0, 1, 0),
            new Vector3(0, 0, 1)
        );
    }

    public get Inverted(): Transform3 {
        const ret = Transform3.XY(
            new Point3(0, 0, 0),
            new Vector3(this.XVec.X, this.YVec.X, this.ZVec.X),
            new Vector3(this.XVec.Y, this.YVec.Y, this.ZVec.Y)
        );

        const orig = new Point3(-this.Origin.X, -this.Origin.Y, -this.Origin.Z);
        ret.Origin = ret.point3(orig);

        return ret;
    }

    public XVec: Vector3;
    public YVec: Vector3;
    public ZVec: Vector3;
    public Origin: Point3;

    constructor(origin?: Point3, xvec?: Vector3, yvec?: Vector3, zvec?: Vector3) {
        this.Origin = origin ? origin.clone() : new Point3(0, 0, 0);
        this.XVec = xvec ? xvec.clone() : new Vector3(1, 0, 0);
        this.YVec = yvec ? yvec.clone() : new Vector3(0, 1, 0);
        this.ZVec = zvec ? zvec.clone() : new Vector3(0, 0, 1);
    }

    public static XY(origin: Point3, x: Vector3, y: Vector3): Transform3 {
        const xvec = x.UnitVector;
        const zvec = x.clone().cross(y).UnitVector;
        const yvec = zvec.clone().cross(x).UnitVector;

        return new Transform3(origin, xvec, yvec, zvec);
    }

    public static YX(origin: Point3, y: Vector3, x: Vector3): Transform3 {
        const yvec = y.UnitVector;
        const zvec = x.clone().cross(y).UnitVector;
        const xvec = y.clone().cross(zvec).UnitVector;

        return new Transform3(origin, xvec, yvec, zvec);
    }

    public static YZ(origin: Point3, y: Vector3, z: Vector3): Transform3 {
        const yvec = y.UnitVector;
        const xvec = y.clone().cross(z).UnitVector;
        const zvec = xvec.clone().cross(y).UnitVector;

        return new Transform3(origin, xvec, yvec, zvec);
    }

    public static ZY(origin: Point3, z: Vector3, y: Vector3): Transform3 {
        const zvec = z.UnitVector;
        const xvec = y.clone().cross(z).UnitVector;
        const yvec = z.clone().cross(xvec).UnitVector;

        return new Transform3(origin, xvec, yvec, zvec);
    }

    public static Translation(x: number, y: number, z: number) {
        const ret = new Transform3();
        ret.Origin = new Vector3(x, y, z);
        return ret;
    }

    public static Rotation(x: number, y: number, z: number, angle: number) {
        const ret = new Transform3();

        const v = new Vector3(x, y, z).UnitVector;
        const s = Math.sin(angle);
        const c = Math.cos(angle);

        ret.XVec = new Vector3(c + x * x * (1 - c), y * x * (1 - c) + z * s, z * x * (1 - c) - y * s);
        ret.YVec = new Vector3(x * y * (1 - c) - z * s, c + y * y * (1 - c), z * y * (1 - c) + x * s);
        ret.ZVec = new Vector3(x * z * (1 - c) + y * s, y * z * (1 - c) - x * s, c + z * z * (1 - c));

        return ret;
    }

    public static XZ(origin: Point3, x: Vector3, z: Vector3): Transform3 {
        const xvec = x.UnitVector;
        const yvec = z.clone().cross(x).UnitVector;
        const zvec = x.clone().cross(yvec).UnitVector;

        return new Transform3(origin, xvec, yvec, zvec);
    }

    public static ZX(origin: Point3, z: Vector3, x: Vector3): Transform3 {
        const zvec = z.UnitVector;
        const yvec = z.clone().cross(x).UnitVector;
        const xvec = yvec.clone().cross(z).UnitVector;

        return new Transform3(origin, xvec, yvec, zvec);
    }

    public static fromArray(m: number[]): Transform3 {
        return Transform3.XY(new Point3(m[3], m[7], m[11]),
            new Vector3(m[0], m[4], m[8]), new Vector3(m[1], m[5], m[9]));
    }

    public toArray(): number[] {
        const ret = new Matrix4();

        ret.data[0] = this.XVec.X;
        ret.data[1] = this.YVec.X;
        ret.data[2] = this.ZVec.X;
        ret.data[3] = this.Origin.X;
        ret.data[4] = this.XVec.Y;
        ret.data[5] = this.YVec.Y;
        ret.data[6] = this.ZVec.Y;
        ret.data[7] = this.Origin.Y;
        ret.data[8] = this.XVec.Z;
        ret.data[9] = this.YVec.Z;
        ret.data[10] = this.ZVec.Z;
        ret.data[11] = this.Origin.Z;

        return ret.data;
    }

    public point3(point: Point3): Point3 {
        return this.Origin.clone().add(this.XVec.clone().multiply(point.X))
        .add(this.YVec.clone().multiply(point.Y)).add(this.ZVec.clone().multiply(point.Z));
    }

    public multiply(transform: Transform3): Transform3 {

        const m11 = this.XVec.X * transform.XVec.X + this.YVec.X * transform.XVec.Y +
            this.ZVec.X * transform.XVec.Z;
        const m12 = this.XVec.X * transform.YVec.X + this.YVec.X * transform.YVec.Y +
            this.ZVec.X * transform.YVec.Z;
        const m13 = this.XVec.X * transform.ZVec.X + this.YVec.X * transform.ZVec.Y +
            this.ZVec.X * transform.ZVec.Z;
        const m14 = this.XVec.X * transform.Origin.X + this.YVec.X * transform.Origin.Y +
            this.ZVec.X * transform.Origin.Z + this.Origin.X;
        const m21 = this.XVec.Y * transform.XVec.X + this.YVec.Y * transform.XVec.Y +
            this.ZVec.Y * transform.XVec.Z;
        const m22 = this.XVec.Y * transform.YVec.X + this.YVec.Y * transform.YVec.Y +
            this.ZVec.Y * transform.YVec.Z;
        const m23 = this.XVec.Y * transform.ZVec.X + this.YVec.Y * transform.ZVec.Y +
            this.ZVec.Y * transform.ZVec.Z;
        const m24 = this.XVec.Y * transform.Origin.X + this.YVec.Y * transform.Origin.Y +
            this.ZVec.Y * transform.Origin.Z + this.Origin.Y;
        const m31 = this.XVec.Z * transform.XVec.X + this.YVec.Z * transform.XVec.Y +
            this.ZVec.Z * transform.XVec.Z;
        const m32 = this.XVec.Z * transform.YVec.X + this.YVec.Z * transform.YVec.Y +
            this.ZVec.Z * transform.YVec.Z;
        const m33 = this.XVec.Z * transform.ZVec.X + this.YVec.Z * transform.ZVec.Y +
            this.ZVec.Z * transform.ZVec.Z;
        const m34 = this.XVec.Z * transform.Origin.X + this.YVec.Z * transform.Origin.Y +
            this.ZVec.Z * transform.Origin.Z + this.Origin.Z;

        this.XVec.set(m11, m21, m31);
        this.YVec.set(m12, m22, m32);
        this.ZVec.set(m13, m23, m33);
        this.Origin.set(m14, m24, m34);

        return this;
    }

    public copy(transform: Transform3): void {

        this.Origin = transform.Origin.clone();
        this.XVec = transform.XVec.clone();
        this.YVec = transform.YVec.clone();
        this.ZVec = transform.ZVec.clone();
    }

    public clone(): Transform3 {
        const ret = new Transform3();
        ret.copy(this);

        return ret;
    }
}
