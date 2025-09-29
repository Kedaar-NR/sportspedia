<?php
# LocalSettings.php template for full local MediaWiki
$wgSitename = "Local Wikipedia";
$wgScriptPath = "/w";
$wgArticlePath = "/wiki/$1";
$wgEnableUploads = true;
$wgUsePathInfo = true;

wfLoadSkin( 'Vector' );
$wgDefaultSkin = 'vector-2022';

# Database
$wgDBtype = 'mysql';
$wgDBserver = getenv('MW_DB_HOST') ?: 'db';
$wgDBname = getenv('MW_DB_NAME') ?: 'mediawiki';
$wgDBuser = getenv('MW_DB_USER') ?: 'wikiuser';
$wgDBpassword = getenv('MW_DB_PASSWORD') ?: 'secret';

# Search via CirrusSearch/Elastica
wfLoadExtension( 'Elastica' );
wfLoadExtension( 'CirrusSearch' );
$wgCirrusSearchClusters = [ 'default' => [ getenv('MW_ES_HOST') ?: 'elasticsearch' ] ];
$wgSearchType = 'CirrusSearch';

$wgLogo = "$wgResourceBasePath/resources/assets/wiki.png";
