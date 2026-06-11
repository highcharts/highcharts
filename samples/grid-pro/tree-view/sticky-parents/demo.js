const columns = [
    ['Root', 24000],
    ['Root/Sales', 6200],
    ['Root/Sales/EMEA', 2400],
    ['Root/Sales/EMEA/Germany', 980],
    ['Root/Sales/EMEA/Germany/Enterprise', 320],
    ['Root/Sales/EMEA/Germany/Mid-Market', 290],
    ['Root/Sales/EMEA/Germany/Channel', 270],
    ['Root/Sales/EMEA/France', 760],
    ['Root/Sales/EMEA/France/Retail', 260],
    ['Root/Sales/EMEA/France/Partners', 230],
    ['Root/Sales/EMEA/Nordics', 660],
    ['Root/Sales/EMEA/Nordics/Public Sector', 210],
    ['Root/Sales/EMEA/Nordics/Growth', 190],
    ['Root/Sales/APAC', 1900],
    ['Root/Sales/APAC/Japan', 780],
    ['Root/Sales/APAC/Japan/Enterprise', 300],
    ['Root/Sales/APAC/Japan/Channel', 250],
    ['Root/Sales/APAC/Australia', 620],
    ['Root/Sales/APAC/Australia/Expansion', 240],
    ['Root/Sales/APAC/Singapore', 500],
    ['Root/Sales/Americas', 1700],
    ['Root/Sales/Americas/East', 700],
    ['Root/Sales/Americas/East/Strategic', 280],
    ['Root/Sales/Americas/East/SMB', 220],
    ['Root/Sales/Americas/West', 620],
    ['Root/Sales/Americas/West/Startup', 250],
    ['Root/Marketing', 4800],
    ['Root/Marketing/Campaigns', 1600],
    ['Root/Marketing/Campaigns/Brand Refresh', 520],
    ['Root/Marketing/Campaigns/Field Events', 480],
    ['Root/Marketing/Campaigns/ABM', 430],
    ['Root/Marketing/Analytics', 1100],
    ['Root/Marketing/Analytics/Attribution', 360],
    ['Root/Marketing/Analytics/Pipeline Reporting', 340],
    ['Root/Marketing/Content Studio', 1400],
    ['Root/Marketing/Content Studio/Website', 420],
    ['Root/Marketing/Content Studio/Case Studies', 390],
    ['Root/Marketing/Content Studio/Video', 360],
    ['Root/Marketing/Community', 700],
    ['Root/Engineering', 8200],
    ['Root/Engineering/Frontend', 2400],
    ['Root/Engineering/Frontend/React Platform', 780],
    ['Root/Engineering/Frontend/React Platform/Grid Shell', 250],
    ['Root/Engineering/Frontend/React Platform/Design System', 230],
    ['Root/Engineering/Frontend/React Platform/Accessibility', 210],
    ['Root/Engineering/Frontend/App Surfaces', 720],
    ['Root/Engineering/Frontend/App Surfaces/Admin', 240],
    ['Root/Engineering/Frontend/App Surfaces/Self-Serve', 220],
    ['Root/Engineering/Frontend/QA Tooling', 520],
    ['Root/Engineering/Backend', 2600],
    ['Root/Engineering/Backend/API', 920],
    ['Root/Engineering/Backend/API/Auth', 300],
    ['Root/Engineering/Backend/API/Billing', 280],
    ['Root/Engineering/Backend/API/Usage', 260],
    ['Root/Engineering/Backend/Data Services', 860],
    ['Root/Engineering/Backend/Data Services/Pipelines', 290],
    ['Root/Engineering/Backend/Data Services/Warehouse', 270],
    ['Root/Engineering/Backend/Integrations', 620],
    ['Root/Engineering/Backend/Integrations/CRM Sync', 210],
    ['Root/Engineering/DevOps', 1700],
    ['Root/Engineering/DevOps/Infrastructure', 620],
    ['Root/Engineering/DevOps/Infrastructure/Kubernetes', 220],
    ['Root/Engineering/DevOps/Infrastructure/Networking', 200],
    ['Root/Engineering/DevOps/Observability', 520],
    ['Root/Engineering/DevOps/Release Engineering', 460],
    ['Root/Engineering/Security', 900],
    ['Root/Engineering/Security/IAM', 320],
    ['Root/Engineering/Security/Compliance', 280],
    ['Root/Customer Success', 3600],
    ['Root/Customer Success/Onboarding', 1300],
    ['Root/Customer Success/Onboarding/Mid-Market', 420],
    ['Root/Customer Success/Onboarding/Enterprise', 460],
    ['Root/Customer Success/Support', 1500],
    ['Root/Customer Success/Support/Tier 1', 420],
    ['Root/Customer Success/Support/Tier 2', 460],
    ['Root/Customer Success/Support/Escalations', 500],
    ['Root/Customer Success/Education', 700],
    ['Root/Finance', 2100],
    ['Root/Finance/Planning', 780],
    ['Root/Finance/Procurement', 620],
    ['Root/Finance/RevOps', 540],
    ['Root/Finance/RevOps/Billing Ops', 220],
    ['Root/Finance/RevOps/Renewals', 200]
].reduce((prev, acc) => {
    prev.path.push(acc[0]);
    prev.budget.push(acc[1]);
    return prev;
}, { path: [], budget: [] });

Grid.grid('container', {
    data: {
        columns,
        idColumn: 'path',
        treeView: {
            input: {
                type: 'path'
            },
            expandedRowIds: 'all'
        }
    },
    rendering: {
        rows: {
            virtualization: true
        }
    }
});
