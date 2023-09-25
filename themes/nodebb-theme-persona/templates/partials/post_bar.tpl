<div class="topic-main-buttons pull-right inline-block">
    <span class="loading-indicator btn pull-left hidden" done="0">
        <span class="hidden-xs">[[topic:loading_more_posts]]</span> <i class="fa fa-refresh fa-spin"></i>
    </span>

    <!-- IF loggedIn -->
    <button component="topic/mark-unread" class="btn btn-sm btn-default" title="[[topic:mark_unread]]">
        <i class="fa fa-fw fa-inbox"></i><span class="visible-sm-inline visible-md-inline visible-lg-inline"></span>
    </button>
    <!-- ENDIF loggedIn -->

    <!-- IMPORT partials/topic/watch.tpl -->

    <!-- IMPORT partials/topic/sort.tpl -->

    <div class="inline-block">
        <!-- IMPORT partials/thread_tools.tpl -->
    </div>

    <!-- Button to mark topic as resolved -->
    <button id="markResolvedButton" class="btn btn-sm btn-success" title="Mark as Resolved">
        <i class="fa fa-check-circle"></i> Mark as Resolved
    </button>

    <!-- IMPORT partials/topic/reply-button.tpl -->
</div>

<script>

    const markResolvedButton = document.getElementById("markResolvedButton");

    markResolvedButton.addEventListener("click", function () {

        markResolvedButton.textContent = "Resolved";
        markResolvedButton.classList.remove("btn-success");
        markResolvedButton.classList.add("btn-default");
        markResolvedButton.disabled = true; // Optionally, disable the button after marking as resolved
    });
</script>
