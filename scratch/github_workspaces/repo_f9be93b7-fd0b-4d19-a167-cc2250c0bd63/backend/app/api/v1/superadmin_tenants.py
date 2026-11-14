// Kavach Verified Remediation Patch for AUTH-01: Missing Authentication on POST /{tenant_id}/lifecycle/retention-item
// CWE: CWE-306 | OWASP: API2:2023 Broken Authentication
--- a/scratch/github_workspaces/repo_f9be93b7-fd0b-4d19-a167-cc2250c0bd63/backend/app/api/v1/superadmin_tenants.py
+++ b/scratch/github_workspaces/repo_f9be93b7-fd0b-4d19-a167-cc2250c0bd63/backend/app/api/v1/superadmin_tenants.py
@@ -733,7 +733,7 @@
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
 
 
-@router.post("/{tenant_id}/lifecycle/retention-item", summary="Update retention period for specific item")
+@router.post("/{tenant_id}/lifecycle/retention-item", authenticateToken, summary="Update retention period for specific item")
 async def update_retention_item(
     tenant_id: str,
     payload: UpdateRetentionItemRequest,
