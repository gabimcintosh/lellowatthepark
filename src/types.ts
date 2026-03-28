export interface RiddleT {
    id: string;
    pw: string;
    riddle: string;
    description: string;
    unlocked: boolean;
}

export interface ProgramT {
    name: string;
    active: boolean;
    riddles: RiddleT[];
}

export interface AppSaveDataT {
    [jsonFileName: string]: ProgramT;
};