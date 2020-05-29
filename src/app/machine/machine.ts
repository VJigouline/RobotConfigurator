import { Link } from './link';

export class MachineExport {
    public MainChain: string[];
    public Links: Link[];

    constructor(machine: Machine) {
        this.MainChain = new Array<string>();
        for (const l of machine.Links) { this.MainChain.push(l.ID); }
        this.Links = machine.Links;
    }
}

export class Machine {
    public Links = new Array<Link>();

    constructor(machine?: MachineExport) {
        if (!machine || !machine.Links || !machine.Links.length) { return; }

        const link = new Link();
        for (const l of machine.Links) {
            this.Links.push(new Link(l));
        }
    }

    public toJSON(): MachineExport {
        return new MachineExport(this);
    }
}
