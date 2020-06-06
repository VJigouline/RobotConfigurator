import { Link, Model, ModelExport } from './link';

export class MachineExport2 {
    public MainChain: string[];
    public TableChain: string[];
}

export class MachineExport {
    public Name: string;
    public Machine: MachineExport2;
    public Links: Link[];
    public Models: ModelExport[];

    constructor(machine: Machine) {
        if (!machine) { return; }
        this.Name = machine.Name;
        this.Machine = new MachineExport2();
        this.Machine.MainChain = [];
        this.Machine.TableChain = [];
        if (machine.MainChain) {
            let l = machine.MainChain;
            while (l) {
                this.Machine.MainChain.push(l.ID);
                l = l.Children.length ? l.Children[0] : null;
            }
        }
        if (machine.TableChain) {
            let l = machine.TableChain;
            while (l) {
                this.Machine.TableChain.push(l.ID);
                l = l.Children.length ? l.Children[0] : null;
            }
        }
        this.Links = machine.Links;
        for (const l of machine.Links) {
            if (l.models && l.models.length) {
                if (!this.Models) { this.Models = new Array<ModelExport>()}
                for (const m of l.models) {
                    this.Models.push(new ModelExport(m));
                }
            }
        }
    }
}

export class Machine {
    public Name = 'Machine';
    public Links = new Array<Link>();
    public MainChain: Link;
    public TableChain: Link;
    public Models = new Array<Model>();

    public get FreeLinks(): Link[] {
        const ret = new Array<Link>();

        for (const l of this.Links) {
            if (!l.Parent && !l.Children.length &&
                l !== this.MainChain && l !== this.TableChain) { ret.push(l); }
        }

        return ret;
    }

    constructor(machine?: MachineExport) {
        if (!machine || !machine.Links || !machine.Links.length) { return; }

        this.Name = machine.Name ? machine.Name : 'Machine';

        const link = new Link();
        for (const l of machine.Links) {
            this.Links.push(new Link(l));
        }

        let parent: Link;
        if (machine.Machine && machine.Machine.MainChain) {
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
        parent = null;
        if (machine.Machine && machine.Machine.TableChain) {
            for (const id of machine.Machine.TableChain) {
                let l = this.Links.find(lnk => lnk.ID === id);
                if (!l) {
                    l = new Link();
                    l.ID = id;
                }
                if (parent) {
                    parent.Children.push(l);
                    l.Parent = parent;
                } else {
                    this.TableChain = l;
                }
                parent = l;
            }
        }

        if (machine.Models) {
            for (const m of machine.Models) {
                const model = new Model(m);
                this.Models.push(model);
            }
        }
    }

    public toJSON(): MachineExport {
        return new MachineExport(this);
    }
}
