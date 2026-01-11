    -- Fix Infinite Recursion in organization_members RLS

    -- 1. Create a secure function to get user's organizations
    -- This functions runs as the creator (postgres/admin) so it bypasses RLS
    CREATE OR REPLACE FUNCTION get_user_org_ids()
    RETURNS SETOF UUID
    SECURITY DEFINER
    SET search_path = public
    LANGUAGE plpgsql
    AS $$
    BEGIN
    RETURN QUERY SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid();
    END;
    $$;

    -- 2. Drop the recursive SELECT policy
    DROP POLICY IF EXISTS "Users can view members of their orgs" ON public.organization_members;

    -- 3. Create the non-recursive policy
    CREATE POLICY "Users can view members of their orgs"
    ON public.organization_members FOR SELECT
    USING (
        organization_id IN (SELECT get_user_org_ids())
    );

    -- 4. Fix INSERT policy to be safe (though less likely to recurse if SELECT is fixed, let's be safe)
    DROP POLICY IF EXISTS "Owners can manage members" ON public.organization_members;

    CREATE POLICY "Owners can manage members"
    ON public.organization_members FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM public.organization_members
            WHERE user_id = auth.uid()
            AND role IN ('owner', 'admin')
        )
    );
    -- Note: The subquery above allows 'SELECT' which now uses the fixed get_user_org_ids() policy, 
    -- or we could use a helper function for 'is_org_admin' too. 
    -- But typically fixing the SELECT policy breaks the cycle.
