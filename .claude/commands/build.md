# Build Features Workflow

You are executing a structured, multi-pattern development workflow for a Shopify theme.

## Instructions

### Phase 1: Analysis (Use Parallel Subagents)

Before creating tasks, use the **Explore subagent** to research relevant parts of the codebase in parallel:
- Spawn multiple explore agents simultaneously to understand existing patterns
- Identify files that need modification
- Find existing implementations to follow as examples

Example: If building 3 features, launch 3 explore agents in parallel to research each area.

### Phase 2: Planning (Create Task List)

After research completes, create a task list:
1. **Parse the request** - Extract features, improvements, or fixes
2. **Create tasks** using TaskCreate with:
   - Clear, actionable subject (imperative: "Add...", "Fix...", "Update...")
   - Detailed description with acceptance criteria from research
   - activeForm for progress display (present continuous: "Adding...")
3. **Set dependencies** - Use TaskUpdate to set blockedBy for dependent tasks
4. **Identify parallelizable work** - Note which tasks are independent

### Phase 3: Execution (Sequential + Background)

Execute tasks using the appropriate pattern:

**For dependent tasks** → Execute sequentially:
- Mark as `in_progress` before starting
- Implement the feature
- Mark as `completed` when done
- Move to next unblocked task

**For independent tasks** → Consider parallel execution:
- If multiple tasks don't depend on each other, work on them together
- Use subagents for isolated, well-defined subtasks

**For long-running operations** → Use background tasks:
- Run theme check in background: `shopify theme check` with run_in_background
- Run theme push in background if needed
- Continue with next task while waiting

### Phase 4: Verification

After all tasks complete:
1. Run `shopify theme check` to validate
2. Verify changes with `shopify theme dev` (user will test in browser)
3. Provide summary of what was built

## Pattern Decision Guide

| Situation | Pattern |
|-----------|---------|
| Need to understand codebase first | Parallel Explore subagents |
| Features depend on each other | Sequential task execution |
| Features are independent | Parallel task execution |
| Running theme validation | Background tasks |
| Complex isolated feature | Dedicated subagent |

## Shopify-Specific Notes

- No build step required - CSS/JS are served as-is
- Test with `shopify theme dev -s keybarus.myshopify.com`
- Deploy with `shopify theme push -s keybarus.myshopify.com -t 186764001563 --allow-live`
- Framework changes should go to BODE-shopify first, then pull upstream

## User's Request

$ARGUMENTS

## Begin

1. First, analyze the request and identify what research is needed
2. Launch parallel explore agents to research relevant areas
3. Create the task list based on findings
4. Execute using the appropriate patterns
5. Verify and summarize
