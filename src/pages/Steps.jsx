import RBStepPage from '../components/RBStepPage';

const PlaceholderContent = ({ title }) => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="bg-gray-50 p-8 rounded-2xl border border-dashed border-gray-200 text-center">
            <p className="text-gray-400 font-medium italic">Workspace content for {title} implementation will go here.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gray-50 rounded-xl animate-pulse"></div>
            <div className="h-32 bg-gray-50 rounded-xl animate-pulse delay-75"></div>
            <div className="h-32 bg-gray-50 rounded-xl animate-pulse delay-150"></div>
            <div className="h-32 bg-gray-50 rounded-xl animate-pulse delay-200"></div>
        </div>
    </div>
);

export const Step01 = () => (
    <RBStepPage
        stepId={1}
        title="01 — Problem Statement"
        description="Defining the gap in the current resume building market."
        workspaceContent={<PlaceholderContent title="Problem Definition" />}
    />
);

export const Step02 = () => (
    <RBStepPage
        stepId={2}
        title="02 — Market Analysis"
        description="Analyzing competitors and target audience needs."
        workspaceContent={<PlaceholderContent title="Market Research" />}
    />
);

export const Step03 = () => (
    <RBStepPage
        stepId={3}
        title="03 — System Architecture"
        description="Defining the high-level flow and data structures."
        workspaceContent={<PlaceholderContent title="Architecture Map" />}
    />
);

export const Step04 = () => (
    <RBStepPage
        stepId={4}
        title="04 — High Level Design"
        description="Drafting the UI/UX components and user journey."
        workspaceContent={<PlaceholderContent title="HLD / UI Flow" />}
    />
);

export const Step05 = () => (
    <RBStepPage
        stepId={5}
        title="05 — Low Level Design"
        description="Defining component props and state management."
        workspaceContent={<PlaceholderContent title="LLD / Data Model" />}
    />
);

export const Step06 = () => (
    <RBStepPage
        stepId={6}
        title="06 — Build Execution"
        description="The core implementation of the AI Resume Builder."
        workspaceContent={<PlaceholderContent title="Build Environment" />}
    />
);

export const Step07 = () => (
    <RBStepPage
        stepId={7}
        title="07 — Testing & QA"
        description="Verifying features and fixing edge cases."
        workspaceContent={<PlaceholderContent title="QA Dashboard" />}
    />
);

export const Step08 = () => (
    <RBStepPage
        stepId={8}
        title="08 — Deployment"
        description="Finalizing assets and preparing for production."
        workspaceContent={<PlaceholderContent title="Shipping Portal" />}
    />
);
