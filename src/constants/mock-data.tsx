import { Subject } from "../types";

export const MOCK_SUBJECTS: Subject[] = [
    {
        id: 1,
        code: "CS101",
        name: "Introduction to Computer Science",
        department: "CS",
        description: "An introductory course covering the fundamental concepts of computer science and programming.",
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        code: "MATH201",
        name: "Calculus II",
        department: "Math",
        description: "Advanced study of integration, sequences, series, and power series.",
        createdAt: new Date().toISOString(),
    },
    {
        id: 3,
        code: "ENG102",
        name: "Literature and Composition",
        department: "English",
        description: "A course focused on critical reading and writing through the study of various literary genres.",
        createdAt: new Date().toISOString(),
    },
    {
        id: 4,
        code: "PHY301",
        name: "Physics I",
        department: "Physics",
        description: "Comprehensive study of mechanics, thermodynamics, and waves.",
        createdAt: new Date().toISOString(),
    },
    {
        id: 5,
        code: "HIST150",
        name: "World History",
        department: "History",
        description: "Survey of major historical events and civilizations from ancient times to the modern era.",
        createdAt: new Date().toISOString(),
    },
    {
        id: 6,
        code: "CHEM110",
        name: "General Chemistry",
        department: "Chemistry",
        description: "Introduction to chemical principles, atomic structure, and chemical bonding.",
        createdAt: new Date().toISOString(),
    }
];