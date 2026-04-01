export interface Riddle {
    id: string;
    pw: string;
    riddle: string;
    description: string;
    unlocked: boolean;
}

export interface Program {
    name: string;
    active: boolean;
    riddles: Riddle[];
}

export interface AppSaveData {
    [jsonFileName: string]: Program;
};
