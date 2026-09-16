-- Keep planner/project-idea RLS semantics unchanged while ensuring auth.uid()
-- is evaluated once per statement instead of once per row.

DROP POLICY IF EXISTS "project ideas owner insert" ON public.project_ideas;
DROP POLICY IF EXISTS "project ideas owner select" ON public.project_ideas;
DROP POLICY IF EXISTS "project ideas owner update" ON public.project_ideas;
DROP POLICY IF EXISTS "project ideas owner delete" ON public.project_ideas;

CREATE POLICY "project ideas owner insert"
  ON public.project_ideas FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = owner_id);

CREATE POLICY "project ideas owner select"
  ON public.project_ideas FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = owner_id);

CREATE POLICY "project ideas owner update"
  ON public.project_ideas FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = owner_id)
  WITH CHECK ((SELECT auth.uid()) = owner_id);

CREATE POLICY "project ideas owner delete"
  ON public.project_ideas FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS planner_tasks_select_own ON public.planner_tasks;
DROP POLICY IF EXISTS planner_tasks_insert_own ON public.planner_tasks;
DROP POLICY IF EXISTS planner_tasks_update_own ON public.planner_tasks;
DROP POLICY IF EXISTS planner_tasks_delete_own ON public.planner_tasks;

CREATE POLICY planner_tasks_select_own
  ON public.planner_tasks FOR SELECT TO public
  USING ((SELECT auth.uid()) = owner_id);

CREATE POLICY planner_tasks_insert_own
  ON public.planner_tasks FOR INSERT TO public
  WITH CHECK ((SELECT auth.uid()) = owner_id);

CREATE POLICY planner_tasks_update_own
  ON public.planner_tasks FOR UPDATE TO public
  USING ((SELECT auth.uid()) = owner_id)
  WITH CHECK ((SELECT auth.uid()) = owner_id);

CREATE POLICY planner_tasks_delete_own
  ON public.planner_tasks FOR DELETE TO public
  USING ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS planner_notes_select_own ON public.planner_notes;
DROP POLICY IF EXISTS planner_notes_insert_own ON public.planner_notes;
DROP POLICY IF EXISTS planner_notes_update_own ON public.planner_notes;
DROP POLICY IF EXISTS planner_notes_delete_own ON public.planner_notes;

CREATE POLICY planner_notes_select_own
  ON public.planner_notes FOR SELECT TO public
  USING ((SELECT auth.uid()) = owner_id);

CREATE POLICY planner_notes_insert_own
  ON public.planner_notes FOR INSERT TO public
  WITH CHECK ((SELECT auth.uid()) = owner_id);

CREATE POLICY planner_notes_update_own
  ON public.planner_notes FOR UPDATE TO public
  USING ((SELECT auth.uid()) = owner_id)
  WITH CHECK ((SELECT auth.uid()) = owner_id);

CREATE POLICY planner_notes_delete_own
  ON public.planner_notes FOR DELETE TO public
  USING ((SELECT auth.uid()) = owner_id);

CREATE OR REPLACE FUNCTION public.set_planner_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
