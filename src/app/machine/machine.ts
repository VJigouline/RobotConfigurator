import { Link } from './link';

export class MachineExport2 {
    public MainChain: string[];
}

export class MachineExport {
    public Machine: MachineExport2;
    public Links: Link[];

    constructor(machine: Machine) {
        this.Machine = new MachineExport2();
        this.Machine.MainChain = new Array<string>();
        for (const l of machine.Links) { this.Machine.MainChain.push(l.ID); }
        this.Links = machine.Links;
    }
}

export class Machine {
    public Links = new Array<Link>();
    public MainChain: Link;

    public get FreeLinks(): Link[] {
        const ret = new Array<Link>();

        for (const l of this.Links) {
            if (!l.Parent && !l.Children.length) { ret.push(l); }
        }

        return ret;
    }

    constructor(machine?: MachineExport) {
        if (!machine || !machine.Links || !machine.Links.length) { return; }

        const link = new Link();
        for (const l of machine.Links) {
            this.Links.push(new Link(l));
        }

        let parent: Link;
        for (const id of machine.Machine.MainChain) {
            let l = this.Links.find(lnk => lnk.ID === id);
            if (!l) {
                l = new Link();
                l.ID = id;
            }
            if (parent) {
                parent.Children.push(l);
                l.Parent = parent;
            } else {
                this.MainChain = l;
            }
            parent = l;
        }
    }

    public toJSON(): MachineExport {
        return new MachineExport(this);
    }
}
